import { Injectable } from '@nestjs/common';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

@Injectable()
export class VideoProcessor {
	constructor() {}

	async processVideo(inputPath: string, outputDir: string) {
		return new Promise<string>((resolve, reject) => {
			const probeargs = ['-v', 'quiet', '-print_format', 'json', '-show_format', '-show_streams', inputPath];
			const hasAudio = spawn('ffprobe', probeargs);
			const varStreamMap = hasAudio ? 'v:0,a:0 v:1,a:1 v:2,a:2' : 'v:0 v:1 v:2';

			const args = [
				'-i',
				inputPath,

				'-filter_complex',
				'[0:v]split=3[v360][v720][v1080];' + '[v360]scale=-2:360[v360out];' + '[v720]scale=-2:720[v720out];' + '[v1080]scale=-2:1080[v1080out]',

				// 360p
				'-map',
				'[v360out]',
				'-map',
				'0:a?',
				'-c:v:0',
				'libx264',
				'-b:v:0',
				'800k',
				'-c:a:0',
				'aac',
				'-b:a:0',
				'96k',

				// 720p
				'-map',
				'[v720out]',
				'-map',
				'0:a?',
				'-c:v:1',
				'libx264',
				'-b:v:1',
				'2500k',
				'-c:a:1',
				'aac',
				'-b:a:1',
				'128k',

				// 1080p
				'-map',
				'[v1080out]',
				'-map',
				'0:a?',
				'-c:v:2',
				'libx264',
				'-b:v:2',
				'5000k',
				'-c:a:2',
				'aac',
				'-b:a:2',
				'192k',

				// HLS settings
				'-hls_time',
				'5',
				'-hls_list_size',
				'0',
				'-hls_flags',
				'independent_segments',
				'-master_pl_name',
				'master.m3u8',
				'-var_stream_map',
				varStreamMap,

				'-hls_segment_filename',
				`${outputDir}/datas/part%v_%02d.bruh`,
				'-hls_base_url',
				'datas/',

				`${outputDir}/%v.m3u8`,
			];

			console.log('Making video resolutions...');

			fs.mkdirSync(path.join(outputDir, 'datas'), { recursive: true });

			const ffmpeg = spawn('ffmpeg', args);

			ffmpeg.stderr.on('data', (data) => {
				const msg = data.toString();
				process.stdout.write(msg);
				const match = msg.match(/time=(\d+:\d+:\d+\.\d+)/);
				if (match) {
					console.log('Processing...', match[1]);
				}
			});

			ffmpeg.on('error', (err) => {
				console.error('FFmpeg Error:', err.message);
				reject(err);
			});

			ffmpeg.on('close', (code) => {
				if (code === 0) {
					console.log('Making video resolutions finished.');
					resolve(`${outputDir}/master.m3u8`);
				} else {
					reject(new Error(`FFmpeg exited with code ${code}`));
				}
			});
		});
	}
	async processThumbnails(inputPath: string, outputDir: string) {
		try {
			const framesDir = path.join(outputDir, 'frames');
			const spriteWidth = 160;
			const spriteHeight = 90;
			const thumbnailsPerRow = 5;
			const secondsPerThumb = 3;

			fs.mkdirSync(framesDir, { recursive: true });
			fs.mkdirSync(outputDir, { recursive: true });
			// ------------------- Generate thumbnails -------------------------
			function generateThumbnails(inputVideo: string, framesDir: string, secondsPerThumb: number, spriteWidth: number, spriteHeight: number) {
				return new Promise((resolve, reject) => {
					const outputPath = path.join(framesDir, 'thumb-%04d.jpg');
					const args = ['-hide_banner', '-loglevel', 'error', '-i', inputVideo, '-vf', `fps=1/${secondsPerThumb},scale=${spriteWidth}:${spriteHeight}`, '-q:v', '2', outputPath];
					const ffmpeg = spawn('ffmpeg', args);
					ffmpeg.stderr.on('data', (data) => process.stdout.write(data.toString()));
					ffmpeg.on('error', reject);
					ffmpeg.on('close', (code) => {
						if (code === 0) resolve('');
						else reject(new Error(`FFmpeg exited with code ${code}`));
					});
				});
			}
			// ------------------- Step 1: Extract frames ----------------------
			const extractFrames = async () => {
				return await generateThumbnails(inputPath, framesDir, secondsPerThumb, spriteWidth, spriteHeight);
			};
			// ------------------- Step 2: Make sprite sheet -------------------
			const makeSprite = async () => {
				const files = (await fs.readdirSync(framesDir)).filter((f) => f.endsWith('.jpg')).sort();

				const rows = Math.ceil(files.length / thumbnailsPerRow);
				const sprite = sharp({
					create: {
						width: thumbnailsPerRow * spriteWidth,
						height: rows * spriteHeight,
						channels: 3,
						background: { r: 0, g: 0, b: 0 },
					},
				});

				const composites = files.map((file, i) => {
					const x = (i % thumbnailsPerRow) * spriteWidth;
					const y = Math.floor(i / thumbnailsPerRow) * spriteHeight;
					return { input: path.join(framesDir, file), left: x, top: y };
				});

				await sprite.composite(composites).toFile(path.join(outputDir, 'sprite.jpg'));

				return files.length;
			};
			// ------------------- Step 3: Generate VTT ------------------------
			const generateVTT = (frameCount: number) => {
				let vtt = 'WEBVTT\n\n';
				for (let i = 0; i < frameCount; i++) {
					const startSec = i * secondsPerThumb;
					const endSec = (i + 1) * secondsPerThumb;

					const row = Math.floor(i / thumbnailsPerRow);
					const col = i % thumbnailsPerRow;
					const x = col * spriteWidth;
					const y = row * spriteHeight;

					const startTime = new Date(startSec * 1000).toISOString().substr(11, 12);
					const endTime = new Date(endSec * 1000).toISOString().substr(11, 12);

					vtt += `${i}\n`;
					vtt += `${startTime} --> ${endTime}\n`;
					vtt += `${framesDir}/sprite.jpg#xywh=${x},${y},${spriteWidth},${spriteHeight}\n\n`;
				}

				fs.writeFileSync(path.join(outputDir, 'sprite.vtt'), vtt, 'utf8');
				console.log('✅ Sprite sheet and VTT ready!');
				return path.join(outputDir, 'sprite.vtt');
			};

			console.log('Extracting frames...');
			await extractFrames();

			console.log('Making sprite sheet...');
			const count = await makeSprite();

			console.log('Generating VTT...');
			const out = generateVTT(count);
			return out;
		} catch (err) {
			console.error(err);
			return err;
		}
	}
}
