import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

export async function processPreviews(inputVideo: string, outputDir: string) {
	const framesDir = path.join(outputDir, 'frames');
	const spriteWidth = 160;
	const spriteHeight = 90;
	const thumbnailsPerRow = 5;
	const secondsPerThumb = 3;

	fs.mkdirSync(framesDir, { recursive: true });
	fs.mkdirSync(outputDir, { recursive: true });

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

	// ------------------- Step 1: Extract frames -------------------
	async function extractFrames() {
		return await generateThumbnails(inputVideo, framesDir, secondsPerThumb, spriteWidth, spriteHeight);
	}
	// ------------------- Step 2: Make sprite sheet -------------------
	async function makeSprite() {
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
	}
	// ------------------- Step 3: Generate VTT -------------------
	function generateVTT(frameCount: number) {
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
	}

	console.log('Extracting frames...');
	await extractFrames();

	console.log('Making sprite sheet...');
	const count = await makeSprite();

	console.log('Generating VTT...');
	const out = generateVTT(count);
	return out;
}
