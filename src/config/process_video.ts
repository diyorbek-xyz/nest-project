import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

export function processVideo(inputPath: string, outputDir: string) {
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
