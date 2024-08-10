import { Options } from 'python-shell';

export const config: Options = {
  mode: 'json',
  scriptPath: './libs/python/src/scripts/',
  pythonOptions: ['-u'],
  stderrParser: (log) => console.log('Python Error Parser ' + log),
};
