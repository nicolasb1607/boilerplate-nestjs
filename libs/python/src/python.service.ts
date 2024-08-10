// src/python/python.service.ts
import { Injectable } from '@nestjs/common';
import { config } from 'libs/python/python.config';
import { PythonShell, PythonShellError } from 'python-shell';

@Injectable()
export class PythonService {
  async runScript(scriptName: string, args: string[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
      const options = { ...config, args };
      const shell = new PythonShell(scriptName, options);

      const output: any[] = [];
      const errorOutput: string[] = [];

      shell.on('message', (message) => {
        output.push(message);
      });

      shell.on('stderr', (stderr) => {
        errorOutput.push(stderr);
      });

      shell.end((err: PythonShellError) => {
        if (err) {
          return reject({ error: err, stderr: errorOutput });
        }
        resolve(output);
      });
    });
  }
}
