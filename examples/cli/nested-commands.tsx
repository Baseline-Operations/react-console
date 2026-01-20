/**
 * Nested Commands Example
 * Demonstrates nested commands (subcommands) with defaults
 */

import { render } from '../../src/index';
import { CLIApp, CommandRouter, Command, Default } from '../../src/cli';
import { Text, View } from '../../src/index';
import { useCommand, useCommandPath } from '../../src/cli';

function App() {
  return (
    <CLIApp name="nested-cli" version="1.0.0" description="Nested commands example">
      <CommandRouter description="Main application router">
        <Default description="Default interface">
          <HomeComponent />
        </Default>
        
        <Command name="build" aliases={['b']} description="Build project">
          <BuildComponent />
          
          {/* Nested command acts as subcommand */}
          <Command name="dev" description="Development build">
            <DevBuildComponent />
          </Command>
          
          <Command name="prod" description="Production build">
            <ProdBuildComponent />
          </Command>
          
          {/* Default for build command when no subcommand matches */}
          <Default description="Default build interface">
            <DefaultBuildComponent />
          </Default>
        </Command>
        
        <Command name="serve" aliases={['s']} description="Start server">
          <ServeComponent />
          
          <Command name="dev" description="Development server">
            <DevServeComponent />
          </Command>
          
          <Command name="prod" description="Production server">
            <ProdServeComponent />
          </Command>
        </Command>
      </CommandRouter>
    </CLIApp>
  );
}

function HomeComponent() {
  return (
    <View padding={1}>
      <Text bold color="cyan">Nested Commands CLI</Text>
      <Text>Available commands:</Text>
      <Text>  build [dev|prod] - Build project</Text>
      <Text>  serve [dev|prod] - Start server</Text>
    </View>
  );
}

function BuildComponent() {
  const command = useCommand();
  const path = useCommandPath();
  
  return (
    <View padding={1}>
      <Text bold color="yellow">Build Command</Text>
      <Text>Command: {command}</Text>
      <Text>Path: {path.join(' ')}</Text>
      <Text>Use 'build dev' or 'build prod' for specific builds.</Text>
    </View>
  );
}

function DevBuildComponent() {
  const path = useCommandPath();
  
  return (
    <View padding={1}>
      <Text bold color="green">Development Build</Text>
      <Text>Command path: {path.join(' ')}</Text>
      <Text>Building for development environment...</Text>
    </View>
  );
}

function ProdBuildComponent() {
  const path = useCommandPath();
  
  return (
    <View padding={1}>
      <Text bold color="red">Production Build</Text>
      <Text>Command path: {path.join(' ')}</Text>
      <Text>Building for production environment...</Text>
    </View>
  );
}

function DefaultBuildComponent() {
  return (
    <View padding={1}>
      <Text bold>Default Build</Text>
      <Text>No specific build type specified.</Text>
      <Text>Use 'build dev' or 'build prod' for specific builds.</Text>
    </View>
  );
}

function ServeComponent() {
  return (
    <View padding={1}>
      <Text bold color="blue">Serve Command</Text>
      <Text>Use 'serve dev' or 'serve prod' for specific servers.</Text>
    </View>
  );
}

function DevServeComponent() {
  return (
    <View padding={1}>
      <Text bold color="green">Development Server</Text>
      <Text>Starting development server...</Text>
    </View>
  );
}

function ProdServeComponent() {
  return (
    <View padding={1}>
      <Text bold color="red">Production Server</Text>
      <Text>Starting production server...</Text>
    </View>
  );
}

// Run the app
if (require.main === module) {
  render(<App />, { mode: 'interactive' });
}

export default App;
