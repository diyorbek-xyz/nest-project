import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

export async function processPoster(inputPath: string, outputDir: string, title?: string) {
	const outputPath = path.join(outputDir, 'poster.png');
	fs.mkdirSync(outputDir, { recursive: true });

	const metadata = `<x:xmpmeta xmlns:x="adobe:ns:meta/">
                        <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
                            <rdf:Description xmlns:dc="http://purl.org/dc/elements/1.1/">
                                <dc:anime>${title ?? 'amediatv'}</dc:anime>
                                <dc:creator>Diyorbek</dc:creator>
                                <dc:telegram>@diyorbek-xyz</dc:telegram>
                                <dc:website>https://amediatv.uz</dc:website>
                            </rdf:Description>
                        </rdf:RDF>
                    </x:xmpmeta>`;

	await sharp(inputPath)
		.resize({
			width: 854,
			height: 480,
			fit: 'cover',
			position: 'center',
		})
		.withXmp(metadata)
		.toFormat('png', { compression: 'hevc', compressionLevel: 5, quality: 85, alphaQuality: 80, preset: 'drawing' })
		.toFile(outputPath)
		.then(() => console.info('Poster compression completed!'));

	fs.unlinkSync(inputPath);
	return outputPath;
}
