import { SSMLBuilder } from '../src/index';
import type { ExpressAsStyle } from '../src/types';

console.log('=== Azure Voices Example ===\n');

// Example with different Azure neural voices and styles
// Define the type for the voices array
interface VoiceConfig {
  name: string;
  style: ExpressAsStyle;  // Use the specific type instead of string
}

const voices: VoiceConfig[] = [
  { name: 'en-US-AvaNeural', style: 'cheerful' },
  { name: 'en-US-AndrewNeural', style: 'newscast' },
  { name: 'en-US-EmmaNeural', style: 'narration-professional' },
  { name: 'en-US-JennyNeural', style: 'customerservice' }
];

voices.forEach(({ name, style }) => {
  const ssml = new SSMLBuilder({ lang: 'en-US' })
    .voice(name)
      .expressAs(`Hello! This is ${name} speaking with ${style} style.`, { style })
      .break('500ms')
      .text('I can express different emotions and styles.')
    .build();

  console.log(`\n${name} with ${style} style:`);
  console.log(ssml);
});

// Multi-language example
const multiLangSSML = new SSMLBuilder({ lang: 'en-US' })
  .voice('en-US-AvaNeural')
    .text('Hello! I can speak multiple languages. ')
    .lang('es-ES', lang => lang
      .text('Hola, puedo hablar español. ')
    )
    .lang('fr-FR', lang => lang
      .text('Bonjour, je peux parler français. ')
    )
    .lang('de-DE', lang => lang
      .text('Hallo, ich kann Deutsch sprechen.')
    )
  .build();

console.log('\n\nMulti-language SSML:');
console.log(multiLangSSML);
