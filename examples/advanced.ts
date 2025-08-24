import { SSMLBuilder } from '../src/index';
import { SentenceElement } from '../src/elements/SentenceElement';
import { SayAsElement } from '../src/elements/SayAsElement';
import { SubElement } from '../src/elements/SubElement';

console.log('=== Advanced SSML Example ===\n');

// Complex example with multiple features
const advancedSSML = new SSMLBuilder({ lang: 'en-US' })
  .backgroundAudio({
    src: 'https://example.com/background-music.mp3',
    volume: '0.3',
    fadein: '2000ms',
    fadeout: '1500ms'
  })
  .voice('en-US-AvaNeural')
    .paragraph(p => p
      .text('Welcome to our presentation. ')
      .addElement(new SentenceElement()
        .text('This is the first sentence of the first paragraph.')
      )
    )
    .silence({ type: 'Sentenceboundary', value: '200ms' })
    .expressAs('I am so excited to share this with you!', { 
      style: 'excited',
      styledegree: '2'
    })
    .break('1s')
    .text('The current date is ')
    .sayAs('2025-08-24', { 
      interpretAs: 'date', 
      format: 'ymd' 
    })
    .text(' and the price is ')
    .sayAs('42.50', { 
      interpretAs: 'currency',
      detail: 'USD'
    })
    .bookmark('pricing_end')
    .paragraph(p => p
      .text('Let me spell something for you: ')
      .addElement(new SayAsElement('SSML', { interpretAs: 'spell-out' }))
      .text('. ')
      .addElement(new SubElement('W3C', 'World Wide Web Consortium'))
      .text(' is the organization behind many web standards.')
    )
    .audio('https://example.com/sound-effect.mp3', 'Sound effect here')
  .build();

console.log('Advanced SSML Output:');
console.log(advancedSSML);
console.log('\n');

// Save to file
import { writeFileSync, mkdirSync } from 'fs';

// Create output directory if it doesn't exist
try {
  mkdirSync('output', { recursive: true });
} catch (e) {
  // Directory already exists
}

writeFileSync('output/advanced.xml', advancedSSML);
console.log('Saved to output/advanced.xml');
