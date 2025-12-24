import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { RICH_BLOG_TOPICS } from './data'; // <--- Import the data file you just made

// ---------------------------------------------------------------------------
// TIPTAP JSON GENERATOR (Updated for Rich Text)
// ---------------------------------------------------------------------------
const generateRichContent = (title: string, fullBody: string, image: string, price: number) => {
  // Split the "fullBody" string into separate paragraphs so it looks good
  const paragraphs = fullBody.split('\n').filter(p => p.trim().length > 0);

  const contentNodes = [
    // 1. Heading
    { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: title }] },
    
    // 2. First Paragraph
    { type: 'paragraph', content: [{ type: 'text', text: paragraphs[0] || '' }] },
    
    // 3. Rich Image
    { type: 'image', attrs: { src: image, alt: title, title: title } },
    
    // 4. Second Paragraph
    { type: 'paragraph', content: [{ type: 'text', text: paragraphs[1] || '' }] },

    // 5. THE PRODUCT CARD
    {
      type: 'productCard',
      attrs: {
        title: title,
        price: price,
        image: image,
        link: `/experiences/${title.toLowerCase().replace(/ /g, '-')}`,
        badge: "Recommended"
      }
    },

    // 6. Remaining Paragraphs
    ...paragraphs.slice(2).map(text => ({
      type: 'paragraph',
      content: [{ type: 'text', text: text }]
    }))
  ];

  return {
    type: 'doc',
    content: contentNodes
  };
};

export async function GET() {
  try {
    const batch = adminDb.batch();
    const collectionRef = adminDb.collection('articles');

    // 🟢 Loop through the RICH data from AI Studio
    RICH_BLOG_TOPICS.forEach((item) => {
      const docRef = collectionRef.doc(); 
      
      const contentEn = generateRichContent(item.en.title, item.en.fullBody, item.image, item.cardPrice);
      const contentFr = generateRichContent(item.fr.title, item.fr.fullBody, item.image, item.cardPrice);
      const contentEs = generateRichContent(item.es.title, item.es.fullBody, item.image, item.cardPrice);

      batch.set(docRef, {
        slug: item.slug,
        status: 'published',
        coverImage: item.image,
        author: "Local Expert",
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
        translations: {
          en: { title: item.en.title, content: contentEn },
          fr: { title: item.fr.title, content: contentFr },
          es: { title: item.es.title, content: contentEs }
        }
      });
    });

    await batch.commit();

    return NextResponse.json({ 
      success: true, 
      message: `✅ Successfully seeded ${RICH_BLOG_TOPICS.length} AI-generated articles!` 
    });
  } catch (error) {
    console.error("Seeding error:", error);
    return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
  }
}