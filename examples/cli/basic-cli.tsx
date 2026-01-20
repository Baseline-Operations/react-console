/**
 * Basic CLI Application Example
 * Demonstrates a simple CLI app with commands and default component
 */

import { render } from '../../src/index';
import { CLIApp, CommandRouter, Command, Default } from '../../src/cli';
import { Text, View } from '../../src/index';

function App() {
  return (
    <CLIApp name="basic-cli" version="1.0.0" description="A basic CLI application example">
      <CommandRouter description="Main application router">
        <Default description="Default interface">
          <HomeComponent />
        </Default>
        
        <Command name="hello" description="Say hello">
          <HelloComponent />
        </Command>
        
        <Command name="info" description="Show application info">
          <InfoComponent />
        </Command>
      </CommandRouter>
    </CLIApp>
  );
}

function HomeComponent() {
  return (
    <View padding={1}>
      <Text bold color="cyan">Welcome to Basic CLI!</Text>
      <Text>Available commands:</Text>
      <Text>  hello - Say hello</Text>
      <Text>  info  - Show application info</Text>
      <Text>Run 'basic-cli --help' for more information.</Text>
    </View>
  );
}

function HelloComponent() {
  return (
    <View padding={1}>
      <Text bold color="green">Hello, World!</Text>
      <Text>This is a simple command example.</Text>
    </View>
  );
}

function InfoComponent() {
  return (
    <View padding={1}>
      <Text bold>Application Information</Text>
      <Text>Name: basic-cli</Text>
      <Text>Version: 1.0.0</Text>
      <Text>Description: A basic CLI application example</Text>
    </View>
  );
}

// Run the app
if (require.main === module) {
  render(<App />, { mode: 'interactive' });
}

export default App;
