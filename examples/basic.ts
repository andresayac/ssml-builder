import { SSMLBuilder } from '../src/index';

console.log('=== Basic SSML Example ===\n');

// Simple example with text and breaks - now this works!
const basicSSML = new SSMLBuilder({ lang: 'en-US' })
  .voice('en-US-AvaNeural')
    .text('Hello! ')
    .break('500ms')
    .text('Welcome to the SSML Builder library.')
    .break({ strength: 'medium' })
    .text('This is a simple example.')
  .build();

console.log('Basic SSML:');
console.log(basicSSML);
console.log('\n');

// Example with emphasis and prosody
const emphasisSSML = new SSMLBuilder({ lang: 'en-US' })
  .voice('en-US-AvaNeural')
    .text('This is ')
    .emphasis('very important', 'strong')
    .text(' information. ')
    .prosody('And this is spoken slowly.', { rate: 'slow', pitch: 'low' })
  .build();

console.log('Emphasis and Prosody SSML:');
console.log(emphasisSSML);

// Multiple voices example
const multiVoiceSSML = new SSMLBuilder({ lang: 'en-US' })
  .voice('en-US-AvaNeural')
    .text('Hello from Ava! ')
  .voice('en-US-AndrewNeural')  // Chain to another voice
    .text('And hello from Andrew!')
  .build();

console.log('\nMultiple Voices SSML:');
console.log(multiVoiceSSML);
