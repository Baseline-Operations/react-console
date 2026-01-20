/**
 * Commands with Parameters Example
 * Demonstrates commands with parameters and options
 */

import { render } from '../../src/index';
import { CLIApp, CommandRouter, Command, Default } from '../../src/cli';
import { Text, View } from '../../src/index';
import { useCommandParams, useCommandOptions } from '../../src/cli';

function App() {
  return (
    <CLIApp name="params-cli" version="1.0.0" description="Commands with parameters example">
      <CommandRouter description="Main application router">
        <Default description="Default interface">
          <HomeComponent />
        </Default>
        
        <Command 
          name="build" 
          description="Build project"
          params={[
            { name: 'target', type: 'string', required: false },
            { name: 'env', type: 'string', required: true },
          ]}
          options={{
            minify: { type: 'boolean', default: false, description: 'Minify output' },
            output: { type: 'string', description: 'Output directory' },
            verbose: { type: 'boolean', default: false, aliases: ['v'], description: 'Verbose output' },
          }}
        >
          <BuildComponent />
        </Command>
        
        <Command 
          name="deploy" 
          description="Deploy to server"
          params={[
            { name: 'server', type: 'string', required: true },
          ]}
          options={{
            force: { type: 'boolean', default: false, description: 'Force deployment' },
            port: { type: 'number', default: 8080, description: 'Server port' },
          }}
        >
          <DeployComponent />
        </Command>
      </CommandRouter>
    </CLIApp>
  );
}

function HomeComponent() {
  return (
    <View padding={1}>
      <Text bold color="cyan">Commands with Parameters CLI</Text>
      <Text>Available commands:</Text>
      <Text>  build &lt;env&gt; [target] - Build project</Text>
      <Text>  deploy &lt;server&gt; - Deploy to server</Text>
      <Text>Run 'params-cli --help' for more information.</Text>
    </View>
  );
}

function BuildComponent() {
  const params = useCommandParams();
  const options = useCommandOptions();
  
  return (
    <View padding={1}>
      <Text bold color="yellow">Building Project</Text>
      <Text>Environment: {params.env || 'not specified'}</Text>
      {params.target && <Text>Target: {params.target}</Text>}
      <Text>Minify: {options.minify ? 'Yes' : 'No'}</Text>
      {options.output && <Text>Output: {String(options.output)}</Text>}
      {options.verbose && <Text color="gray">Verbose mode enabled</Text>}
    </View>
  );
}

function DeployComponent() {
  const params = useCommandParams();
  const options = useCommandOptions();
  
  return (
    <View padding={1}>
      <Text bold color="blue">Deploying to Server</Text>
      <Text>Server: {params.server || 'not specified'}</Text>
      <Text>Port: {String(options.port || 8080)}</Text>
      {options.force && <Text color="red">Force deployment enabled</Text>}
    </View>
  );
}

// Run the app
if (require.main === module) {
  render(<App />, { mode: 'interactive' });
}

export default App;
