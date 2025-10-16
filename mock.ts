export type MockStreamOptions = {
	minChunkSize?: number; // 最小 chunk 大小（字符）
	maxChunkSize?: number; // 最大 chunk 大小（字符）
	delayMinMs?: number;   // 每个 chunk 之间最小延迟（毫秒）
	delayMaxMs?: number;   // 每个 chunk 之间最大延迟（毫秒）
	repeat?: number;       // 重复生成同一 payload 的次数（用于更长的流）
};

 
function generateComplexJson() {
	return {
		meta: {
			id: "abc-123-测试-✓".repeat(30),
			timestamp: new Date().toISOString(),
			count: 3,
			flags: {
				active: true,
				verified: false,
				nullable: null
			},
			nestedMap: {
				level1: {
					level2: {
						level3: {
							message: "这是一条包含特殊字符的字符串：\n\t\"quotes\" \\ slash / and emoji 🚀",
							numbers: [1, 2, 3.1415, 1e12, -42],
							hugeNumber: "123456789012345678901234567890" // 保持为字符串以避免精度问题
						}
					}
				}
			}
		},
		items: Array.from({ length: 5 }).map((_, i) => ({
			index: i,
			name: `item-${i}`,
			tags: ["a", "b", "c"].map((t) => `${t}-${i}`),
			payload: {
				text: "多行\n文本\n示例",
				bytes: Buffer.from([i, i + 1, i + 2]).toString("base64"),
				sub: {
					emptyArray: [],
					mixed: [null, true, false, { deep: { value: `v${i}` } }]
				}
			}
		})),
		matrix: [
			[[1, 2], [3, 4]],
			[[5, 6], [7, 8]]
		],
		randomSamples: [
			{ a: 1, b: { c: [1, 2, { d: "end" }] } },
			{ unicode: "汉字漢字", esc: "line1\\nline2", quote: "\"inner\"" }
		]
	};
}

 
function sleep(ms: number) {
	return new Promise((res) => setTimeout(res, ms));
}

 
function splitIntoChunks(str: string, minSize: number, maxSize: number) {
	const chunks: string[] = [];
	let i = 0;
	while (i < str.length) {
		const remaining = str.length - i;
		const size = Math.max(minSize, Math.min(remaining, Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize));
		chunks.push(str.slice(i, i + size));
		i += size;
	}
	if (chunks.length === 0) chunks.push(str);
	return chunks;
}

 
export async function* mockJsonChunkStream(options: MockStreamOptions = {}) {
	const {
		minChunkSize = 1,
		maxChunkSize = 5 ,
		delayMinMs = 10,
		delayMaxMs = 100,
		repeat = 1
	} = options;

	const base = JSON.stringify(generateComplexJson());
	const combined = Array.from({ length: Math.max(1, repeat) }).map(() => base).join("");
	const chunks = splitIntoChunks(combined, minChunkSize, maxChunkSize);

	for (const chunk of chunks) {
		const delay = Math.floor(Math.random() * (delayMaxMs - delayMinMs + 1)) + delayMinMs;
		await sleep(delay);
		yield chunk;
	}
}
 
export async function mockJsonStreamToCallback(callback: (chunk: string) => void, options: MockStreamOptions = {}) {
	for await (const chunk of mockJsonChunkStream(options)) {
		try {
			callback(chunk);
		} catch {
		}
	}
}

