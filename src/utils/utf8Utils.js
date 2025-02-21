import { readTextFile, writeTextFile, BaseDirectory } from '@tauri-apps/plugin-fs';

// 读取文件时使用 UTF-8 编码
export async function readFileUtf8(filePath) {
	const data = await readTextFile(filePath, { baseDir: BaseDirectory.Resource });
	const decoder = new TextDecoder('utf-8');
	return decoder.decode(data);
}

// 写入文件时使用 UTF-8 编码
export async function writeFileUtf8(filePath, content) {
	const encoder = new TextEncoder();
	const data = encoder.encode(content);
	await writeTextFile(filePath, data, { baseDir: BaseDirectory.Resource });
}