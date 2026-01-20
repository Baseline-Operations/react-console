/**
 * Path-Based Commands Example
 * Demonstrates commands with path prop (work as both command and route)
 */

import { render } from '../../src/index';
import { CLIApp, CommandRouter, Command, Default } from '../../src/cli';
import { Text, View } from '../../src/index';
import { useCommand, usePath, useRoute } from '../../src/cli';

function App() {
  return (
    <CLIApp name="path-cli" version="1.0.0" description="Path-based commands example">
      <CommandRouter description="Main application router">
        <Default description="Default interface">
          <HomeComponent />
        </Default>
        
        {/* Command with path - accessible as both 'build' command and '/build' route */}
        <Command name="build" path="/build" description="Build project">
          <BuildComponent />
          
          {/* Nested command with path */}
          <Command name="dev" path="/build/dev" description="Development build">
            <DevBuildComponent />
          </Command>
          
          <Command name="prod" path="/build/prod" description="Production build">
            <ProdBuildComponent />
          </Command>
        </Command>
        
        {/* Command without path - only accessible as command */}
        <Command name="serve" description="Start server">
          <ServeComponent />
        </Command>
      </CommandRouter>
    </CLIApp>
  );
}

function HomeComponent() {
  return (
    <View padding={1}>
      <Text bold color="cyan">Path-Based Commands CLI</Text>
      <Text>Commands with paths work as both commands and routes:</Text>
      <Text>  build - Accessible as 'build' command or '/build' route</Text>
      <Text>  build dev - Accessible as 'build dev' or '/build/dev'</Text>
      <Text>  serve - Only accessible as 'serve' command (no path)</Text>
    </View>
  );
}

function BuildComponent() {
  const command = useCommand();
  const path = usePath();
  const route = useRoute();
  
  return (
    <View padding={1}>
      <Text bold color="yellow">Build Command</Text>
      <Text>Command: {command}</Text>
      <Text>Path: {path}</Text>
      {route && <Text>Route: {route.location}</Text>}
      <Text>This command is accessible both as 'build' and '/build'.</Text>
    </View>
  );
}

function DevBuildComponent() {
  const command = useCommand();
  const path = usePath();
  
  return (
    <View padding={1}>
      <Text bold color="green">Development Build</Text>
      <Text>Command: {command}</Text>
      <Text>Path: {path}</Text>
      <Text>Accessible as 'build dev' or '/build/dev'.</Text>
    </View>
  );
}

function ProdBuildComponent() {
  const command = useCommand();
  const path = usePath();
  
  return (
    <View padding={1}>
      <Text bold color="red">Production Build</Text>
      <Text>Command: {command}</Text>
      <Text>Path: {path}</Text>
      <Text>Accessible as 'build prod' or '/build/prod'.</Text>
    </View>
  );
}

function ServeComponent() {
  const command = useCommand();
  const path = usePath();
  
  return (
    <View padding={1}>
      <Text bold color="blue">Serve Command</Text>
      <Text>Command: {command}</Text>
      <Text>Path: {path || 'none (command only)'}</Text>
      <Text>This command is only accessible as 'serve', not as a route.</Text>
    </View>
  );
}

// Run the app
if (require.main === module) {
  render(<App />, { mode: 'interactive' });
}

export default App;
