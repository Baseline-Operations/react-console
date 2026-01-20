/**
 * Help Customization Example
 * Demonstrates custom help components
 */

import { render } from '../../src/index';
import { CLIApp, CommandRouter, Command, Default } from '../../src/cli';
import { Text, View } from '../../src/index';
import type { HelpProps } from '../../src/cli';

function App() {
  // Custom help component for the app
  const CustomAppHelp = (props: HelpProps) => (
    <View padding={1}>
      <Text bold color="cyan" size="large">{props.app.name} v{props.app.version}</Text>
      <Text>{props.app.description}</Text>
      <View marginTop={1}>
        <Text bold>Custom Help Display</Text>
        <Text>This is a custom help component!</Text>
      </View>
    </View>
  );
  
  return (
    <CLIApp name="help-cli" version="1.0.0" description="Help customization example">
      <CommandRouter description="Main application router" help={CustomAppHelp}>
        <Default description="Default interface">
          <HomeComponent />
        </Default>
        
        <Command 
          name="build" 
          description="Build project"
          help={(props) => (
            <View padding={1}>
              <Text bold color="yellow">Custom Build Help</Text>
              <Text>Command: {props.command?.name}</Text>
              <Text>This is a custom help component for the build command.</Text>
            </View>
          )}
        >
          <BuildComponent />
        </Command>
        
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
      <Text bold color="cyan">Help Customization CLI</Text>
      <Text>This app demonstrates custom help components.</Text>
      <Text>Run 'help-cli --help' to see custom app help.</Text>
      <Text>Run 'help-cli build --help' to see custom command help.</Text>
      <Text>Run 'help-cli serve --help' to see auto-generated help.</Text>
    </View>
  );
}

function BuildComponent() {
  return (
    <View padding={1}>
      <Text bold color="yellow">Build Command</Text>
      <Text>This command has custom help.</Text>
    </View>
  );
}

function ServeComponent() {
  return (
    <View padding={1}>
      <Text bold color="blue">Serve Command</Text>
      <Text>This command uses auto-generated help.</Text>
    </View>
  );
}

// Run the app
if (require.main === module) {
  render(<App />, { mode: 'interactive' });
}

export default App;
