import { SSMLBuilder } from '../src/index';

console.log('=== Conversation Example ===\n');

// Simple conversation between two voices
const conversationSSML = new SSMLBuilder({ lang: 'en-US' })
  .voice('en-US-AvaMultilingualNeural')
    .text('Good morning!')
  .voice('en-US-AndrewMultilingualNeural')
    .text('Good morning to you too Ava!')
  .build();

console.log('Simple Conversation:');
console.log(conversationSSML);
console.log('\n');

// More complex conversation with emotions and pauses
const complexConversation = new SSMLBuilder({ lang: 'en-US' })
  .voice('en-US-AvaNeural')
    .expressAs('Oh, hello there!', { style: 'cheerful' })
    .break('500ms')
    .text('How are you doing today?')
  .voice('en-US-AndrewNeural')
    .text("I'm doing great, thanks for asking!")
    .break('300ms')
    .expressAs('How about you?', { style: 'friendly' })
  .voice('en-US-AvaNeural')
    .expressAs("I'm wonderful!", { style: 'excited' })
    .text(' I just got some great news.')
  .voice('en-US-AndrewNeural')
    .expressAs('That sounds amazing!', { style: 'excited' })
    .text(' What happened?')
  .build();

console.log('Complex Conversation with Emotions:');
console.log(complexConversation);
console.log('\n');

// Multilingual conversation
const multilingualConversation = new SSMLBuilder({ lang: 'en-US' })
  .voice('en-US-AvaMultilingualNeural')
    .text('Hello! I can speak multiple languages.')
    .lang('es-ES', lang => lang
      .text(' ¡Hola! Puedo hablar español.')
    )
  .voice('en-US-AndrewMultilingualNeural')
    .text("That's impressive!")
    .lang('fr-FR', lang => lang
      .text(' Moi aussi, je peux parler français!')
    )
  .build();

console.log('Multilingual Conversation:');
console.log(multilingualConversation);
console.log('\n');

// Conversation with bookmarks and audio
const advancedConversation = new SSMLBuilder({ lang: 'en-US' })
  .backgroundAudio({
    src: 'https://example.com/ambient-cafe.mp3',
    volume: '0.2',
    fadein: '1000ms'
  })
  .voice('en-US-AvaNeural')
    .bookmark('ava_start')
    .text('Welcome to our podcast!')
    .break('500ms')
    .text("Today we're discussing artificial intelligence.")
  .voice('en-US-AndrewNeural')
    .bookmark('andrew_start')
    .text("That's right, Ava.")
    .break('300ms')
    .prosody('This is a fascinating topic', { rate: 'slow', pitch: '+5%' })
    .text(' that affects everyone.')
  .voice('en-US-AvaNeural')
    .text('Absolutely! ')
    .emphasis('AI is everywhere', 'strong')
    .text(' these days.')
    .audio('https://example.com/transition-sound.mp3', 'transition sound')
  .voice('en-US-AndrewNeural')
    .text("Let's dive into the details.")
    .bookmark('discussion_start')
  .build();

console.log('Advanced Conversation with Background Audio:');
console.log(advancedConversation);
console.log('\n');

// Role-playing conversation
const rolePlayConversation = new SSMLBuilder({ lang: 'en-US' })
  .voice('en-US-JennyNeural')
    .expressAs('Hello, how may I help you today?', { 
      style: 'customerservice' 
    })
  .voice('en-US-GuyNeural')
    .text("Hi, I'd like to inquire about my order.")
    .break('300ms')
    .text('Order number is ')
    .sayAs('12345', { interpretAs: 'digits' })
  .voice('en-US-JennyNeural')
    .text('Let me check that for you.')
    .silence({ type: 'Sentenceboundary', value: '1000ms' })
    .text('I found your order. ')
    .expressAs('It will be delivered tomorrow!', { 
      style: 'cheerful' 
    })
  .voice('en-US-GuyNeural')
    .expressAs('That\'s wonderful news!', { style: 'excited' })
    .text(' Thank you so much for your help.')
  .build();

console.log('Customer Service Role-Play:');
console.log(rolePlayConversation);
