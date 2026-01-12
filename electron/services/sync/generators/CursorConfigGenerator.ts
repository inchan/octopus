import { FileGenerator, GeneratorContext } from './FileGenerator';

export class CursorConfigGenerator implements FileGenerator {
    async generate(context: GeneratorContext): Promise<string> {
        const config = {
            mcpServers: {} as Record<string, { command: string; args: string[] }>
        };

        context.mcpServers.forEach(server => {
            if (!server.isActive) return;
            config.mcpServers[server.name] = {
                command: server.command,
                args: server.args
            };
        });

        return JSON.stringify(config, null, 2);
    }
}
