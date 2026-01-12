import { FileGenerator, GeneratorContext } from './FileGenerator';

export class CursorRulesGenerator implements FileGenerator {
    async generate(context: GeneratorContext): Promise<string> {
        // .cursorrules is typically a plain text file containing instructions
        const parts: string[] = [];

        context.rules.forEach(rule => {
            parts.push(rule.content);
            parts.push(''); // Separator
        });

        return parts.join('\n');
    }
}
