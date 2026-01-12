
import { ToolDetector } from './services/tool-detection/ToolDetector';

async function run() {
    const detector = new ToolDetector();
    console.log('--- Run 1 ---');
    const result1 = await detector.detect();
    console.log('Run 1 Result:', JSON.stringify(result1, null, 2));

    console.log('Waiting 2 seconds...');
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('--- Run 2 ---');
    const result2 = await detector.detect();
    console.log('Run 2 Result:', JSON.stringify(result2, null, 2));
}

run().catch(console.error);
