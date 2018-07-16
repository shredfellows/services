import nel from 'nel';

export const runCode = (code) => {
  return new Promise (function(resolve, reject) {
    let session = new nel.Session();

    const solution = {};

    let onStdoutArray = [];
    let onStderrArray = [];

    solution.input = code;

    session.execute(code, {
      onSuccess: (output) => {
        solution.return = output.mime['text/plain'];
      },
      onError: (output) => {
        solution.error = output.error;
      },
      onStdout: (output) => {
        onStdoutArray.push(output);
        solution['console.log'] = onStdoutArray;
      },
      onStderr: (output) => {
        onStderrArray.push(output);
        solution['console.error'] = onStderrArray;
      },
      afterRun: () => {
        console.log('In codeRun', { solution });
        resolve(solution);
      },
    });
  });
};