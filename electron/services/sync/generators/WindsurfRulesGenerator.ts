import { Rule } from '../../../../shared/types';
import { GeneratorContext } from './FileGenerator';

export class WindsurfRulesGenerator {
    async generate(context: GeneratorContext): Promise<string> {
        const { rules } = context;

        if (!rules || rules.length === 0) {
            return '';
        }

        // Format: ### Rule Name \n Content \n\n
        return rules
            .map((rule: Rule) => `### ${rule.name}\n${rule.content}`)
            .join('\n\n');
    }
}
