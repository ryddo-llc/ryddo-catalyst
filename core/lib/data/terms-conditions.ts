export interface TermsSection {
  id: string;
  title: string;
  pageTitle?: string; // For PageHeader (clean title)
  description?: string;
  accordionItems: AccordionItem[];
}

export interface AccordionItem {
  id: string;
  title: string;
  content: string;
  description?: string; // Optional intro paragraph for sections with sub-sections
  subsections?: SubSection[];
}

export interface SubSection {
  title: string;
  content: string;
  type?: 'bullet' | 'paragraph';
  titleStyle?: 'bold' | 'italic' | 'normal';
  links?: Array<{
    text: string;
    href: string;
    className?: string;
  }>;
  paragraphs?: string[]; // For multiple paragraphs with automatic spacing
  contentWithLinks?: Array<{
    type: 'text' | 'link';
    content?: string;
    link?: {
      text: string;
      href: string;
      className?: string;
    };
  }>; // For content with embedded links
}

export interface TermsNavigationItem {
  id: string;
  title: string;
  href: string;
  description?: string;
}

export interface WaiverSection {
  id: string;
  title: string;
  content?: string;
  type?: 'paragraph' | 'numbered-list';
  items?: string[];
}

// Navigation items for the sidebar
export const termsNavigationItems: TermsNavigationItem[] = [
  {
    id: 'terms-of-use',
    title: 'Terms of Use',
    href: '/terms-conditions/',
    description: 'General terms and conditions for using our services'
  },
  {
    id: 'shipping-returns',
    title: 'Shipping, Returns, & Exchanges',
    href: '/shipping-returns-exchange-policies/',
    description: 'Our shipping, return, and exchange policies'
  },
  {
    id: 'price-match',
    title: 'Price Match Guarantee',
    href: '/price-match-guarantee/',
    description: 'Our price matching policy and guarantees'
  },
  {
    id: 'privacy-policy',
    title: 'Privacy Policy',
    href: '/privacy-policy/',
    description: 'How we collect, use, and protect your information'
  },
  {
    id: 'test-ride-waiver',
    title: 'Test Ride Waiver',
    href: '/test-ride-waiver/',
    description: 'Terms and conditions for test rides'
  }
];

// Terms of Use page content
export const termsOfUseContent: TermsSection = {
  id: 'terms-of-use',
  title: 'Terms of Use',
  description: `Welcome to Ryddo.com, a website operated by Ryddo LLC. Please read the following Terms and Conditions of Use ("Terms of Use") carefully and ensure you understand them fully. These Terms of Use, including all documents referenced herein, govern your use of the Ryddo website (the "Services") and represent the entire understanding and agreement ("The Agreement") between RYDDO LLC and/or its parent(s), subsidiary(ies) and affiliate(s) (collectively "Ryddo", or "Ryddo.com") and you regarding your use of this website and supersede any prior statements or representations.<br /><br />BY USING OUR SERVICES, YOU ARE ACCEPTING THE PRACTICES DESCRIBED IN THESE TERMS OF USE. IF YOU DO NOT AGREE TO THESE TERMS OF USE, PLEASE DO NOT USE THE SERVICES. WE RESERVE THE RIGHT TO MODIFY OR AMEND THESE TERMS OF USE FROM TIME TO TIME WITHOUT NOTICE, BUT WILL NOTIFY YOU OF ANY MATERIAL CHANGES. YOUR CONTINUED USE OF OUR SERVICES FOLLOWING THE POSTING OF OR NOTICE OF CHANGES TO THESE TERMS WILL MEAN YOU ACCEPT THOSE CHANGES.`,
  accordionItems: [
    {
      id: 'permission-to-use-content',
      title: 'Permission to Use Content',
      content: `Ryddo.com grants you a limited license to access and make personal, noncommercial use of this site and not to download (other than page caching) or modify it, in whole or in part, except with express written consent of Ryddo.com or where expressly permitted. You agree not to use or resell Ryddo.com or the Services it provides for any commercial purpose, including but not limited to sending unsolicited commercial messages. You agree not to use any services provided by Ryddo.com, if applicable, to send SPAM or to send messages to mailing lists for which you do not have the legal right to send or initiate the sending of such message to each recipient. In order to purchase products or services through Ryddo.com, you agree that you are 18 years of age or older, or you are 16 years of age or more and have the specific permission of a parent or legal guardian.`
    },
    {
      id: 'site-services',
      title: 'Site Services',
      content: `Ryddo.com may change, suspend or discontinue any aspect of the products and services at any time, including the availability of any feature or content. Ryddo.com may also impose limits on certain features and services or restrict your access to parts or all of the product and services without notice or liability.`
    },
    {
      id: 'copyright-and-trademark',
      title: 'Copyright and Trademark',
      content: `All content included on this site, photographs, images, moving images, sound, and illustrations (“Content”), is the property of RYDDO, or its Content suppliers or licensors and is protected by the United States and international copyrights, patents, trade secrets, or other forms proprietary rights. The compilation of all Content on this site is the exclusive property of RYDDO and is protected by the U.S. and international copyright laws. You may not modify, publish, transmit, participate in the transfer or sale of, reproduce, create derivative works from, distribute, perform, display, incorporate into another website, or in any other way exploit any of the content, in whole or in part without the specific permission of RYDDO. This prohibition includes but is not limited to, the use of any proprietary RYDDO design on any website, in emails, or in other media without express written permission from Ryddo.com.

All trademarks, service marks, and trade names of Ryddo used or is using herein (collectively “Marks”) are trademarks or registered trademarks of Ryddo or its affiliates, partners, vendors, or licensors. You may not use, copy, reproduce, republish, upload, post, transmit, distribute, or modify Marks in any way, including in advertising or publicity pertaining to distribution of materials on the Services, without Ryddo’s prior written consent. You shall not use Ryddo’s name or any language, pictures, or symbols which could based on Ryddo’s judgment, imply our endorsement in any written or oral advertising or presentation, or brochure, newsletter, book, or other written material of whatever nature, without prior written consent.`
    },
    {
      id: 'your-account-and-conduct',
      title: 'Your Account and Member Conduct',
      content: `To access many features on the site, and to purchase any goods or services, you may be required to create an account with Ryddo.com. Any personal information you provide in connection with your account will be covered by our Privacy Policy. You are responsible for the accuracy of the information included in your account, including updating your information as necessary, maintaining the confidentiality of your password. All activity conducted in connection with your account will be your responsibility, as you are deemed to be in sole possession and control of the confidential password necessary to access your account. You must immediately notify Ryddo.com of any unauthorized access or tampering of your account, or suspected breach of security.

You also acknowledge and agree that Ryddo.com may preserve content and may also disclose content if required to do so by law or in the good faith belief that such preservation or disclosure is reasonably necessary to: (a) comply with legal process; (b) enforce these terms of service; (c) respond to claims that any content violates laws or the rights of third parties; or (d) protect the rights, property or personal safety of Ryddo.com, its users and the public.

If in Ryddo.com’s sole determination, you violate Ryddo.com’s Member Conduct policy, Ryddo.com, may block you, and those using any email account associated with you from using any or all of the services available on Ryddo.com.

RYDDO.COM RESERVES THE RIGHT IN ITS SOLE DISCRETION TO DISCLOSE TO THIRD PARTIES, INCLUDING PRODUCT RECIPIENTS, THEIR COUNSEL, OR LAW ENFORCEMENT AUTHORITIES, RELEVANT INFORMATION ABOUT A COMMUNICATION, INCLUDING, BUT NOT LIMITED TO, THE SENDER NAME, ACCOUNT INFORMATION, MEMBER AND COOKIE NUMBERS, IP ADDRESSES, TRANSMISSION DATA, PAST AND SUBSEQUENT SERVICE USE, AND ANY OTHER INFORMATION DEEMED NECESSARY BY RYDDO.COM TO ASSIST THIRD PARTIES, THEIR COUNSEL AND LAW ENFORCEMENT INVESTIGATE VIOLATIONS OF THE MEMBER CONDUCT POLICY. THESE DISCLOSURES MAY BE MADE WITH OR WITHOUT PRIOR NOTICE TO YOU. BY USING THE SERVICE, YOU IRREVOCABLY CONSENT TO SUCH DISCLOSURES.`
    },
    {
      id: 'deletion-or-deactivation',
      title: 'Deletion or Deactivation of Your Content and/or Your Account',
      content: `You may terminate this Agreement at any time (i) by sending notice in writing to Ryddo.com at 334 S Main St #5017, Los Angeles, CA. 90013 confirming such termination, (ii) by removing all Your Content from your account, (iii) by deleting your account and thereafter by ceasing to use the Website.`
    },
    {
      id: 'payment-and-purchases',
      title: 'Payment, Purchase of Products or Services',
      content: `You may be required to provide Ryddo with a valid credit card, debit card, or another payment account (“Payment Method”) in order to purchase any products or services provided by Ryddo. When you add a Payment Method to your account, you will be asked to provide customary billing information. You must provide accurate, current, and complete information when adding a Payment Method. You agree to pay all fees and charges incurred through your purchase of any products or services at the time of purchase and at the rates in effect for the billing period in which such fees and charges are incurred. RYDDO does not provide refunds or credits if the price for particular Products or Services previously purchased by you is lowered or is part of a promotional offer. All Products sold through Ryddo.com are subject to our Return and Exchange Policy. For more information, <strong><em>review our full Return and Exchange Policy</em></strong>.`
    },
    {
      id: 'limitation-of-liability',
      title: 'Limitation of Liability',
      content: `UNDER NO CIRCUMSTANCES, INCLUDING BUT NOT LIMITED TO ITS OWN NEGLIGENCE, SHALL RYDDO.COM BE LIABLE FOR ANY DIRECT, INDIRECT, CONSEQUENTIAL, SPECIAL OR EXEMPLARY DAMAGES THAT RESULT FROM THE USE OF, OR THE INABILITY TO USE, THE MATERIALS IN THIS SITE, EVEN IF RYDDO.COM OR A RYDDO.COM AUTHORIZED REPRESENTATIVE HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. APPLICABLE LAW MAY NOT ALLOW THE LIMITATION OR EXCLUSION OF LIABILITY OR INCIDENTAL OR CONSEQUENTIAL DAMAGES, SO THE ABOVE LIMITATION OR EXCLUSION MAY NOT APPLY TO YOU. IN NO EVENT SHALL RYDDO.COM’S TOTAL LIABILITY TO YOU FOR ALL DAMAGES, LOSSES AND CAUSES OF ACTION (WHETHER IN CONTRACT, TORT INCLUDING BUT NOT LIMITED TO NEGLIGENCE OR OTHERWISE) EXCEED THE AMOUNT PAID BY YOU, IF ANY, FOR ACCESSING THIS SITE.`
    },
    {
      id: 'disclaimer-of-warranties',
      title: 'Disclaimer of Warranties',
      content: `The materials in this site are provided “as is” and without warranties of any kind, either expressed or implied. To the fullest extent permissible pursuant to applicable law, Ryddo.com disclaims all warranties, express or implied, including but not limited to implied warranties of merchantability and fitness for a particular purpose and non-infringement. Ryddo.com does not warrant that the functions contained in the materials will be uninterrupted or error-free, that defects will be corrected or that this site or the server that makes it available are free of viruses or other harmful components. Ryddo.com does not warrant or make any representation regarding the use or the results of the use of the materials in this site in terms of their correctness, accuracy, reliability or otherwise. You (and not Ryddo.com) assume the entire cost of all necessary servicing, repair or correction. Applicable law may not allow the exclusion of implied warranties so the above exclusion may not apply to you.`
    },
    {
      id: 'product-information-disclaimer',
      title: 'Product Information Disclaimer',
      content: `It is our intent to provide the most accurate and up-to-date information available throughout the site and in our communications with you. Occasionally, information on Ryddo.com may contain typographical errors, inaccuracies or omissions that may relate to product descriptions, pricing and/or availability. Ryddo.com reserves the right to correct any errors, inaccuracies or omissions and to change or update information at any time without prior notice, including after your order has been submitted. In addition, we reserve the right to cancel orders due to lack of availability, including after your order has been submitted. We apologize for any inconvenience this may cause you.`
    },
    {
      id: 'user-submissions',
      title: 'User Submissions',
      content: `On certain sections of this Site, users may be permitted to: post, display and/or publish (“post”) comments about Ryddo’s products or other materials (“User Content”). You acknowledge and agree that you are solely responsible for any User Content that you post. You further acknowledge and agree that Ryddo has no responsibility for, and makes no representations concerning, any User Content posted at this website and will not be liable for any User Content. With respect to all User Content that you post, you represent and warrant that: (i) the material is fully original to you; (ii) such User Content will not infringe or violate the rights of any person or entity, or violate any governmental rule, regulation statute or law, or the Terms if Use; (iii) no money will be owing to any person or entity as a result of the posting of the User Content or its use as contemplated by these Terms if Use; and (iv) you will be responsible for all User Content submitted through your account, and for all purposes under these Terms and Conditions, all User Content submitted from your account shall be deemed to have been submitted by you.`
    },
    {
      id: 'user-content-license',
      title: 'User Content License',
      content: `User Submissions remain the intellectual property of the individual user. By submitting content to Ryddo, you expressly grant Ryddo a non-exclusive, perpetual, irrevocable, royalty-free, fully paid-up worldwide, fully sub-licensable right to use, reproduce, modify, adapt, publish, translate, create derivative works from, distribute, transmit, perform and display such content, and irrevocably waive any and all “moral rights” (howsoever known) you may have in such User Content and/or consent to Ryddo (or any of its nominees, licensees or successors) engaging in conduct which may otherwise infringe any “moral rights” in your User Content. Further, you understand and agree that Ryddo may retain, but not display, distribute or perform, server copies of User Content that has been deleted or removed. You understand that Ryddo performs technical functions necessary to offer its website and its Services, including but not limited to transcoding and/or reformatting content to allow its use through the Website. You agree that you will make no commercial use of any User Content obtained through this website, without the express written agreement of Ryddo.`
    },
    {
      id: 'innapropriate-user-submissions',
      title: 'Inappropriate User Submissions',
      content: `Ryddo does not encourage, and does not welcome User Submissions that result from any activity that: (i) may create a risk of harm, loss, physical or mental injury, emotional distress, death, disability, disfigurement, or physical or mental illness to you, to any other person, or to any animal; (ii) may create a risk of any other loss or damage to any person or property; or (iii) may constitute a crime or tort.  You agree that you have not and will not engage in any of the foregoing activities in connection with producing your User Submission. Without limiting the foregoing, you agree that in conjunction with your submission, you will not inflict emotional distress on other people, will not humiliate other people (publicly or otherwise), will not assault or threaten other people, will not enter onto private property without permission, will not impersonate any other person or misrepresent your affiliation, title, or authority, and will not otherwise engage in any activity that may result in injury, death, property damage, and/or liability of any kind. Ryddo will reject any User Submissions in which Ryddo believes, in its sole discretion, that any such activities have occurred.  If notified by a user of a submission that allegedly violates any provision of these Terms of Use, Ryddo reserves the right to determine, in its sole discretion, if such a violation has occurred, and to remove any such submission from the Services at any time and without notice.`
    },
    {
      id: 'termination',
      title: 'Termination',
      content: `Either you or Ryddo may suspend or terminate your right to use of Ryddo’s Services at any time, for any reason or for no reason. Ryddo may also block your access to our Services in the event that (a) you breach these Terms of Use; (b) we are unable to verify or authenticate any information you provide to us; or (c) we believe that your actions may cause financial loss or legal liability for you, our users or us.`
    },
    {
      id: 'disputes-and-jurisdiction',
      title: 'Disputes and Jurisdiction',
      content: `In the event you violate these Terms of Use, in RYDDO’s sole discretion, Ryddo.com may at any time, terminate your account, suspend the delivery of or access to, services, refuse membership and/or terminate your membership or subscription, in addition to all other legal rights and remedies available to it.

This Agreement shall be governed by and construed in accordance with the laws of the State of California, without giving effect to any principles of conflicts of law. Any dispute relating in any way to your visit to Ryddo.com or to products you purchase through Ryddo.com shall be submitted to confidential arbitration in Los Angeles, California, except that, to the extent you have in any manner violated or threatened to violate Ryddo.com’s intellectual property rights, Ryddo.com may seek injunctive or other appropriate relief in any state or federal court in the State of California, and you consent to exclusive jurisdiction and venue in such courts. Arbitration under this Agreement shall be conducted under the rules then prevailing of the American Arbitration Association. The arbitrator’s award shall be binding and may be entered as a judgment in any court of competent jurisdiction. To the fullest extent permitted by applicable law, no arbitration under this Agreement shall be joined to an arbitration involving any other party subject to this Agreement, whether through class arbitration proceedings or otherwise, and you agree that you will not participate as a class member or class representative in any action against Ryddo.com.`
    },
    {
      id: 'miscellaneous',
      title: 'Miscellaneous',
      content: `If any provision of this Agreement shall be unlawful, void, or for any reason is unenforceable, then that provision shall be deemed severable from this Agreement and shall not affect the validity and enforceability of any remaining provisions. This is the entire agreement between the parties relating to the subject matter herein and shall not be modified except in writing, signed by both parties.

Ryddo.com makes no representation that materials in the site are appropriate or available for use outside the United States. Those who choose to access this site from outside the United States do so on their own initiative and are responsible for compliance with local laws, if and to the extent local laws are applicable. Individuals also agree to comply with all applicable United States export controls.`
    },
    {
      id: 'severability',
      title: 'Severability',
      content: `Should one or more provisions of these Terms of Use be found to be unlawful, void or unenforceable, such provision(s) shall be deemed severable and will not affect the validity and/or enforceability of the remaining provisions of the Terms of Use, which will remain in full force and effect.`
    },
    {
      id: 'entire-agreement',
      title: 'Entire Agreement',
      content: `These Terms of Use, together with the Privacy Policy constitute the entire Agreement between you and Ryddo.com with respect to your use of the Website and supersede any prior agreement between you and Ryddo.com. Any modifications to this Agreement must be made in writing.`
    },
    {
      id: 'changes-to-terms-of-use',
      title: 'Changes to Terms of Use',
      content: `We reserve the right to change, alter, replace or otherwise modify these Terms of Use at any time. The date of the last modification is stated at the end of these Terms of Use. It is your responsibility to check this page from time to time for updates. Your continued use of the Website will be deemed as irrevocable acceptance of any changes and revisions to these Terms of Use.`
    },
    {
      id: 'copyright-agent',
      title: 'Copyright Agent',
      content: `Ryddo.com respects the intellectual property of others. If you believe that your work has been copied in a way that constitutes copyright infringement, or your intellectual property rights have been otherwise violated, please contact Ryddo.com's Copyright Agent and provide the following information:<br />
<br />
<ul>
<li>An electronic or physical signature of the person authorized to act on behalf of the owner of the copyright or other intellectual property interest;</li>
<li>A description of the copyrighted work or other intellectual property that you claim has been infringed;</li>
<li>A description of where the material that you claim is infringing is located on the site;</li>
<li>Your address, telephone number, and email address;</li>
<li>A statement by you that you have a good faith belief that the disputed use is not authorized by the copyright owner, its agent, or the law;</li>
<li>A statement by you, made under penalty of perjury, that the above information in your Notice is accurate and that you are the copyright or intellectual property owner or authorized to act on the copyright or intellectual property owner's behalf.</li>
</ul>
<br />
Please send your copyright information to:<br /><br />

RYDDO LLC.<br />
1200 S Figueroa St #3214<br />
Los Angeles, CA. 90015<br /><br />

Attention: c/o Warwick Hunt<br />
Email: warwick@ryddo.com`
    }
  ]
};

// Shipping, Returns & Exchanges page content
export const shippingReturnsContent: TermsSection = {
  id: 'shipping-returns',
  title: 'Shipping, Returns, & Exchanges',
  pageTitle: 'Shipping, Returns & Exchanges',
  description: 'We want you to be completely satisfied with your purchase. Please review our shipping, return, and exchange policies below.',
  accordionItems: [
    {
      id: 'shipping-policy',
      title: 'Shipping Policy',
      content: '',
      subsections: [
        {
          title: '',
          content: 'We make every effort to ship within 24-48 business hours once the purchases have received final approval. We do our best to ship products the same day, when possible. Orders that arrive before 12pm PST are often shipped the same day, when inventory is stocked at our retail location. Some products may be drop-shipped from third parties. Most of our electric scooters and bikes are shipped through UPS or Fedex ground services and delivery times range from 2 days in California to 4-5 days on the east coast but may vary greatly with delays. Call for a more definitive delivery estimation. We do offer express delivery through UPS, Fedex and USPS. We do not ship outside of the US, and can not ship battery operated products to Alaska and Hawaii at this time.',
          type: 'paragraph'
        }
      ]
    },
    {
      id: 'returns-exchanges-policy',
      title: 'Returns & Exchanges Policy',
      content: '',
      description: 'We want you to be fully satisfied with every item that you purchase from Ryddo.com. However, if you need to return an item, we\'re here to help.',
      subsections: [
        {
          title: '7-Day Test Ride',
          titleStyle: 'normal',
          content: 'Applies to select e-scooters, e-bikes or e-boards purchased from Ryddo.com. When the product includes the <strong>“7-Day Test Ride”</strong> banner on the product page you may return the product within (7) seven calendar days from the date of delivery, and we will refund the purchase price, <strong> minus(10%) of the full, non-discounted/sale, listed price,  on the product page and shipping costs both ways, as well as any mileage fees and repair costs, if applicable. The customer may also elect for a store credit for the same amount (Good for 12 months from the original purchase date).</strong> Subject to the following terms and conditions:',
          type: 'paragraph'
        },
        {
          title: 'Normal wear and tear is accepted. Acceptable wear and tear includes a small amount of tread wear equal to no more than <strong>150 miles of normal use</strong>, under typical usage patterns, as well as a minimal amount of wear on the breaks, and deck.',
          content: '',
          type: 'bullet'
        },
        {
          title: 'The product <strong>must be shipped by the end of the seventh day</strong> after delivery.',
          content: '',
          type: 'bullet'
        },
        {
          title: 'If the product is returned with more than 50 miles, you will be charged a $1.00 / mile fee for each mile over 50.',
          content: '',
          type: 'bullet'
        },
        {
          title: 'If the item has any damage beyond normal wear and tear, you will be billed for the cost to repair the damage at the rate of ($60/hr) in addition to the cost of any parts that are required to complete the repair and return the item to a “like new” condition.',
          content: '',
          type: 'bullet'
        },
        {
          title: 'A prepaid return label will be provided to you, upon request. When returning your item, please be sure to use the prepaid shipping label, and send all returned items in their UNDAMAGED ORIGINAL PACKAGING. If the original product packaging is damaged, we may assess a fee up to $50. We recommend that the customer take photos of the box prior to shipping. If original items that were included with the product are not included with the returned item, the cost of such items will be deducted from the amount refunded, at the cost of replacement to our company.',
          content: '',
          type: 'bullet'
        },
        {
          title: '30-Day Return Period for Electric Scooters & Bikes',
          titleStyle: 'normal',
          content: 'Any item purchased from Ryddo.com may be returned within (30) thirty calendar days from the date delivery of the item to you was completed, if the item remains <strong>new, unused, unopened, in its original packaging complete with all originally included materials and all tags still attached to the items. An RMA must be requested and approved or any returned will not be processed.</strong> Upon receipt, processing, and inspection of the returned item, we will refund the purchase price, minus discounts and credits, <strong>minus all shipping costs, outbound and return,</strong>  to you subject to the following terms and conditions:</strong>',
          type: 'paragraph'
        },
        {
          title: 'If you have removed the tags, used the products, or have destroyed the original packaging, we might be unable to accept the return. We reserve the right to refuse your return or exchange request, and the right to charge a restocking fee and other handling costs based on our sole and exclusive discretion.',
          content: '',
          type: 'bullet'
        },
        {
          title: 'Ryddo may charge additional fees for any accepted product returns which are found to be damaged upon receipt and inspection by Ryddo.',
          content: '',
          type: 'bullet'
        },
        {
          title: 'A prepaid return label will supplied upon request.  Please use this label and contact the shipping company for a pickup or drop-off. If insurance is included in the shipping it is the responsibility of the customer to obtain the required signatures to validate the insurance policy. UPS requires that a UPS driver, or an official UPS Customer Center must sign the documents. A UPS Store is not acceptable. The customer can use their shipping company of choice but Ryddo will not be responsible for lost or damaged products. It is at the customers discretion to purchase insurance for the package.',
          content: '',
          type: 'bullet'
        },
        {
          title: 'Should the customer believe any items to be defective the customer must bring this to the attention of Ryddo prior to use. Once the product has been used it can no longer be returned for a refund and defective items would be covered under manufacturer warranty.',
          content: '',
          type: 'bullet'
        },
      ]
    },
    {
      id: 'important',
      title: '**IMPORTANT**',
      content: '',
      subsections: [
        {
          title: '',
          content: 'Ryddo takes no responsibility for returned items that do not reach us. We strongly suggest that the customer insures any shipped packages for the minimum cost of the products.',
          type: 'paragraph'
        }
      ]
    },
    {
      id: 'frequently-asked-questions',
      title: 'Frequently Asked Questions',
      content: '',
      subsections: [
        {
          title: 'Q. Can I make a return purchased in store?',
          content: 'Your Ryddo experience is important to us, and we are therefore happy to provide exchanges or refunds for products purchased from either Ryddo.com or a Ryddo retail store, subject to the above return and exchange policy. Items purchased in, and returned to, a retail store location in the original unopened packaging, are entitled to a full refund or exchange within (30) calendar days of purchase.',
          type: 'paragraph'
        },
        {
          title: 'Q. What if I think my item might be faulty?',
          content: 'We only ever want to provide the best quality products to our customers. If you believe that you have received a faulty item, please contact us or submit a request for return or exchange, along with any relevant images, within 24 hours of receipt on used products only. All claims will be covered under the manufacturer’s warranty after the first 24 hours have lapsed. We aim to respond to all requests within 48-72 hours.',
          type: 'paragraph'
        },
        {
          title: 'Q. When will my purchase be refunded?',
          content: 'We will process your refund as soon as we’ve received and inspected your return. You will receive an email confirming that your refund has been processed, and the funds will appear in the original account used to make the purchase within ten (10) business days of the refund being issued, depending on your bank.',
          type: 'paragraph'
        }
      ]
    }
  ]
};

// Price Match Guarantee page content
export const priceMatchContent: TermsSection = {
  id: 'price-match',
  title: 'We Price Match<span class="text-pink-600">!</span>',
  pageTitle: 'Price Match Guarantee',
  description: `We will price match any written or online offer from a U.S. based authorized reseller for the exact same product, tax excluded. The price match must be requested prior to purchase. Ebay and other unauthorized resellers excluded. Please contact us for more details. The customer may submit a request online using the “CLICK TO PRICE MATCH” button on the product pages.`,
  accordionItems: [
    {
      id: 'main-content',
      title: '',
      content: `<h2 class="text-3xl font-bold text-gray-900 mb-6 text-center">We Price Match! <span class="text-pink-600">!</span></h2>We will price match any written or online offer from a U.S. based authorized reseller for the exact same product, tax excluded. The price match must be requested prior to purchase. Ebay and other unauthorized resellers excluded.<br /><br />Please contact us for more details. The customer may submit a request online using the "CLICK TO PRICE MATCH" button on the product pages.`
    }
  ]
};

// Privacy Policy page content
export const privacyPolicyContent: TermsSection = {
  id: 'privacy-policy',
  title: 'Privacy Policy',
  pageTitle: 'Privacy Policy',
  description: `RYDDO LLC. and its affiliates (“RYDDO” or “we”, “our”, “us”) respects the privacy of our consumers. This Privacy Policy (“Privacy Policy”) explains the type of information we collect from individuals that visit our website(s) (each, a “Site”) where this Privacy Policy is posted or otherwise connect with us offline such as via telephone (“Offline Services”, and collectively with all Sites, the “Services” or individually, a “Service”), and how we store, use, disclose and protect such information. By using or accessing our Services, you agree to the collection, storage, use and disclosure of your information as described in this Privacy Policy.`,
  accordionItems: [
    {
      id: 'what-information-we-collect',
      title: 'WHAT INFORMATION WE COLLECT',
      content: '',
      subsections: [
        {
          title: 'Information you give us.',
          content: 'We collect and maintain information that you may provide to us through use of our Services, including shipping address, billing address, credit card information, telephone number(s), email address(es) and purchase/return/exchange data. For example, when you set up your account and/or make online purchases, you will be asked to provide information necessary to facilitate the transaction such as contact and payment information; when you enter our contests, sweepstakes or other promotions, you may be asked for information necessary to fulfill the promotion; when you post comments or other content in publicly available forums on our Services (e.g., Product reviews, Q&A forum), anything you post will be available to us as well as visitors to our Services; when you post information about us on third party social media platforms (each, a “Social Media Service”), we may collect such information through an integration with the Social Media Service provider; when you contact our customer service representatives, we collect additional information you choose to provide our representatives.'
        },
        {
          title: 'Information automatically collected.',
          content: 'We may use technology to automatically collect other information about you when you visit our Services or view our advertisements. See Cookies and Interest Based Advertising, below. This information helps our online Services work correctly and supports our customer marketing and analytics efforts. This information includes, and is not limited to, device type, browser information, operating system information, device IP, device information, IP address, mobile device identifier, software version, phone model, phone operating system, carrier information, geo-location, the date, time, length of stay, referring website and specific pages accessed and other actions you take on our online Service.'
        },
        {
          title: 'Information collected from other sources.',
          content: 'We receive information about you from other sources to help us correct or supplement our records, improve the quality of personalization of our Services to you and prevent or detect fraud. We may use this information consistent with this Privacy Policy.'
        },
        {
          title: 'Information collected through Social Media Services.',
          content: 'You may be able to access our Services through Social Media Services. If you log on to our Services through a Social Media Service, you give us permission to access, store and use any information that you permit the applicable Social Media Service to share with us in accordance with your privacy settings with the applicable Social Media Service. When using Social Media Services with our Services, the Social Media Service provider will be able to collect information from you. We may also place tags and other data collection mechanisms on our Services from Social Media Services through which they can collect information about the usage of our Services and their services across multiple devices (such as your smartphone and your computer) for use by both us and such Social Media Service. We are not responsible or liable for the privacy practices or content of the applicable Social Media Service. We encourage you to review, and if necessary, adjust, your privacy settings with the applicable Social Media Service before logging in to our online Services using the applicable Social Media Service. Information that we receive from Social Media Services is stored and use by us in accordance with this Privacy Policy.'
        }
      ]
    },
    {
      id: 'how-we-use',
      title: 'HOW WE USE YOUR INFORMATION',
      content: '',
      description: 'We use, process and disclose your information we collect for our business purposes, including:',
      subsections: [
        {
          title: 'Responding to your questions and requests.',
          content: 'We use your information to provide you with transactional assistance such as fulfilling your order and ensuring proper delivery of your products, as well as administering promotions such sweepstakes and contests and responding to reviews, comments or other feedback you provide.'
        },
        {
          title: 'Communicating about your account.',
          content: 'We may contact you to tell you about changes to this Privacy Policy, our Terms of Use or changes to our Services, products and programs. We may also tell you about issues with your orders or if there is a product recall.'
        },
        {
          title: 'Improving our products and services.',
          content: 'We may use your information to make improvements to our Sites, including to personalize our service offerings to meet your needs.'
        },
        {
          title: 'Reviewing Site trends and customer interests.',
          content: 'We may use your information to customize your experience with us. We may collect information about your activities on and interactions with various devices and link that information. Through such cross-device linking, we can provide you with a consistent experience across the devices you use. We may also combine information we get from you with information about you we have received from third parties or publicly available sources to assess trends and interests.'
        },
        {
          title: 'Improving marketing communications.',
          content: 'We may send you communications about promotions or offers via regular mail, email or other electronic channels, including ads on Social Media Services. We may use information, including information collected across different online services and collected from the various devices you may use, to deliver marketing communications based on your interests.'
        },
        {
          title: 'Promote our products or services.',
          content: 'If you complete a product review or other feedback or provide any image of yourself, we may use your submission for commercial purposes to promote our products and services.'
        },
        {
          title: 'Other uses we may disclose',
          content: 'We also may use your information with your consent, and as otherwise permitted or required by law.'
        }
      ]
    },
    {
      id: 'what-information-we-disclose',
      title: 'WHAT INFORMATION WE DISCLOSE',
      content: '',
      description: 'RYDDO does not rent, sell, trade or disclose your information to unrelated third parties, except as set forth in this Privacy Policy. We may share your information in limited circumstances, such as to conduct our business, when legally required or with your consent, including:',
      subsections: [
        {
          title: 'Affiliates.',
          content: 'We may share your information with our affiliates for business, operational, promotional, marketing, or other purposes consistent with this Privacy Policy.'
        },
        {
          title: 'Third-Party Service Providers.',
          content: 'We may disclose the information collected about you to our third-party contractors and partners relating to their performing services or other activities in support of our Services and/or our businesses, or their completing or confirming on our behalf a transaction or series of transactions that you conduct with us. Examples include third parties which may fulfill orders, deliver packages, send postal mail and/or e-mail, analyze data, provide marketing research and assistance, process credit card payments and provide customer service. These contractors and partners are restricted from using information that identifies you (excluding any information that is aggregated or otherwise reasonably de-identified) in any way other than to provide services for us.'
        },
        {
          title: 'Business Transfer.',
          content: 'We may disclose, transfer, or assign to our affiliates or to one or more third parties the information collected about you as part of a merger, acquisition or other sale or transfer of any of the assets or business of RYDDO. In the unlikely event of our bankruptcy, insolvency, reorganization, receivership, or assignment for the benefit of creditors, or the application of laws or equitable principles affecting creditors’ rights generally, we may transfer your data to a successor or to a third party that purchases our assets arising from such circumstances. In such transactions, customer information generally is one of the transferred business assets but remains subject to the promises made in any pre-existing Privacy Policy.'
        },
        {
          title: 'Protection of RYDDO and Others.',
          content: 'We may disclose information about you to the government or to other third parties to comply with the law, applicable regulations, governmental and quasi-governmental requests, court orders, subpoenas and other legal process. We may also disclose information to third parties if needed to (i) enforce any of the terms of use for our Services or any investigation of potential violations thereof, (ii) detect, prevent, or otherwise address fraud, security or technical issues, (iii) protect against harm to our Services and (iv) protect our rights, property or safety or the rights, property or safety of our users or others.'
        }
      ]
    },
    {
      id: 'information-from-children',
      title: 'INFORMATION FROM CHILDREN',
      content: '',
      description: 'The Services are not directed at children and we have no intention of collecting information from young people. If we become aware that information from a child under 16 has been collected without the consent of such child’s parent or guardian, we will use all reasonable efforts to delete such information.',
      subsections: []
    },
    {
      id: 'third-party-websites',
      title: 'THIRD PARTY WEBSITES',
      content: '',
      description: 'As a convenience to our visitors, our Services may contain links to several websites that we believe offer useful information. The policies and procedures we describe here do not apply to those websites. We suggest contacting those websites directly for information on their privacy policies. RYDDO is not responsible for the privacy practices of third parties, regardless of whether they are linked or otherwise connected to our Services.',
      subsections: []
    },
    {
      id: 'cookies-and-interest-based-advertising',
      title: 'COOKIES AND INTEREST-BASED ADVERTISING',
      content: '',
      description: 'Tracking tools we use. We and our service providers may collect information about users over time and across different websites and devices through the use of tracking tools including cookies, web beacons, device identifiers and other online information-gathering tools (collectively, "cookies"). While the cookies that we use may change from time to time, we use cookies for the same purposes, including:',
      subsections: [
        {
          title: 'To authenticate your account and store your password if you are a registered account holder;',
          content: '',
          type: 'bullet'
        },
        {
          title: 'To monitor performance of our Services;',
          content: '',
          type: 'bullet'
        },
        {
          title: 'To learn more about the way you interact with our content;',
          content: '',
          type: 'bullet'
        },
        {
          title: 'To personalize your experience on our Sites and Social Media Services;',
          content: '',
          type: 'bullet'
        },
        {
          title: 'To optimize and tailor our Sites;',
          content: '',
          type: 'bullet'
        },
        {
          title: 'To make product recommendations and provide you with advertising content on our Services and elsewhere in which we think you will be interested;',
          content: '',
          type: 'bullet'
        },
        {
          title: 'To measure the effectiveness of personalized ads;',
          content: '',
          type: 'bullet'
        },
        {
          title: 'To pursue analytics and research to help us improve our Services and product offerings;',
          content: '',
          type: 'bullet'
        },
        {
          title: 'To better understand our Site visitors and their respective interests, including by learning about your online activities across devices.',
          content: '',
          type: 'bullet'
        },
        {
          title: 'Interest based advertising',
          content: '',
          type: 'paragraph',
          paragraphs: [
            'We and our service providers may use cookies to learn about what ads you see, what ads you click, and other actions you take on our Sites and other sites. This allows us to provide you with more useful and relevant ads on both RYDDO-owned and operated sites and unaffiliated sites. Interest-based ads, also sometimes referred to as personalized or targeted ads, are displayed to you based on information from activities such as purchasing on our Sites, visiting sites that contain our content or ads, interacting with our tools or using our payment services. In providing interest-based ads, we follow the Self-Regulatory Principles for Online Behavioral Advertising developed by the Digital Advertising Alliance (DAA) (a coalition of marketing, online advertising, and consumer advocacy organizations). See "Advertising Preferences and Opt-out" below to opt-out of such advertising.',
            'Third party advertising management partners may help us display tailored content to our customers\' interests and serve interest-based advertising on our behalf. We do not provide any personal information to advertisers or to third party sites that display our interest-based ads. However, advertisers and other third-parties (including the ad networks, ad-serving companies, and other service providers they may use) may collect information through cookies about your browsing activity on our website to display interest based ads. Also, some third-parties may provide us information about you (such as the sites where you have been shown ads or demographic information) from offline and online sources that we may use to provide you more relevant and useful advertising.',
            'Advertisers or ad companies may be working on their behalf sometimes use technology to serve the ads that appear on our sites directly to your browser. They automatically receive your IP address when this happens. They may also use cookies to measure the effectiveness of their ads and to personalize ad content. We do not have access to or control over cookies or other features that advertisers and third-party websites may use, and the information practices of these advertisers and third-party websites are not covered by our Privacy Policy. Please contact them directly for more information about their privacy practices.'
          ]
        },
      ]
    },
    {
      id: 'advertising-preferences-and-opt-out',
      title: 'ADVERTISING PREFERENCES AND OPT-OUT',
      content: '',
      subsections: [
        {
          title: 'Cookies:',
          content: 'The Help feature on most browsers will tell you how to prevent your browser from accepting new cookies, how to have the browser notify you when you receive a new cookie, or how to disable cookies altogether. If you set your browser to limit or remove cookies or otherwise block our use of cookies, some Site features may be unavailable or unable to function properly.',
          type: 'paragraph'
        },
        {
          title: 'Email marketing opt-out:',
          content: 'If you wish to opt-out of any marketing email communications you may contact our customer service representatives at the phone number or email address below, under Questions. You also may follow opt-out unsubscribe instructions included in our promotional e-mail. Please note that removal of user information from our database or "opting-out" will not stop marketing or advertising content that is generated for distribution or is otherwise queued for transmission to you prior to the time when we can implement your request. Following receipt of a request from you, we will take reasonable steps to delete your information. If you opt-out of marketing communications, you will continue to receive transactional communications, such as e-mail or text notifications about your order status, recall information and other administrative information. Your information will remain in our database, but will be marked as inactive so you do not receive marketing materials from us.',
          type: 'paragraph'
        },
        {
          title: 'Facebook opt-out:',
          content: '',
          type: 'paragraph',
          contentWithLinks: [
            {
              type: 'text',
              content: 'Facebook may provide you with the ability to opt-out of certain advertising practices. See '
            },
            {
              type: 'link',
              link: {
                text: 'https://www.facebook.com/help/1075880512458213',
                href: 'https://www.facebook.com/help/1075880512458213',
                className: 'text-pink-600 hover:text-pink-700 underline'
              }
            },
            {
              type: 'text',
              content: ' However, we are unable to control Facebook\'s practices or disclosures. To opt-out of data collection by other Social Media Services, you should review that provider\'s privacy practices.'
            }
          ]
        },
        {
          title: 'Do-Not-Track:',
          content: 'Some browsers have a “do not track” feature that lets you tell websites that you do not want to have your online activities tracked. Our online Services do not support “do not track” preferences that may be available in your browser and are not capable of satisfying the preference you set.',
          type: 'paragraph'
        }
      ]
    },
        {
      id: 'data-security',
      title: 'DATA SECURITY',
      content: '',
      description: 'We implement reasonable administrative, technical, and physical safeguards designed to protect the information we collect. However, no information system can be 100% secure, so we cannot guarantee the absolute security of your information.',
      subsections: []
    },
        {
      id: 'data-retention',
      title: 'DATA RETENTION',
      content: '',
      description: 'We may retain your data for as long as we believe there is a business, legal or security reason for doing so, even if you are no longer an active customer.',
      subsections: []
    },
        {
      id: 'how-to-update-information',
      title: 'HOW TO UPDATE INFORMATION',
      content: '',
      description: 'You may correct or update information collected about you through our Services by contacting us at the email address noted at the end of this Privacy Policy below, or by editing your information and preferences on the “Your Account” and “Profile and Password” pages. Following receipt of a request from you, we will take reasonable steps to update or correct your information.',
      subsections: []
    },
    {
      id: 'california-residents',
      title: 'CALIFORNIA RESIDENTS',
      content: '',
      subsections: [
        {
          title: '',
          content: '',
          type: 'paragraph',
          contentWithLinks: [
            {
              type: 'text',
              content: 'Section 1798.83 of the California Civil Code permits California residents to request from a business, with whom the California resident has an established business relationship, certain information about the types of personal information the business has shared with third parties for those third parties’ direct marketing purposes and the names and addresses of the third parties with whom the business has shared such information during the immediately preceding calendar year. If you are a California resident, you may make one request each year by sending a request to ['
            },
            {
              type: 'link',
              link: {
                text: 'info@Ryddo.com',
                href: 'mailto:info@Ryddo.com',
                className: 'text-pink-600 hover:text-pink-700 underline'
              }
            },
            {
              type: 'text',
              content: '.]'
            }
          ]
        }
      ]
    },
    {
      id: 'governing-law',
      title: 'GOVERNING LAW',
      content: '',
      description: 'By choosing to visit our Services, you agree that any dispute over privacy or the terms contained in this Privacy Policy will be governed by the law of State of California, without reference to the choice of law or conflicts of law principles thereof, and will be subject to the dispute resolution clause contained in the terms of use applicable to the Services. You also agree to abide by any limitation on damages contained in the terms of use of our Services.',
      subsections: []
    },
    {
      id: 'changes-to-this-policy',
      title: 'CHANGES TO THIS POLICY',
      content: '',
      description: 'We reserve the right, at our discretion, to modify our privacy practices and update and make changes to this Privacy Policy at any time. If we make any changes, we will change the Last updated date above and post the new Privacy Policy here. You should consult this Privacy Policy regularly for any changes.',
      subsections: []
    },
    {
      id: 'questions',
      title: 'QUESTIONS',
      content: '',
      description: 'If there are any questions regarding this Privacy Policy, please contact us!',
      subsections: []
    }
  ]
};

// Test Ride Waiver content
export const testRideWaiverContent: {
  title: string;
  description: string;
  sections: WaiverSection[];
  minorsSection: {
    title: string;
    description: string;
    agreement: string;
  };
} = {
  title: 'PLEASE READ CAREFULLY BEFORE SIGNING!',
  description: 'I, the undersigned, in consideration of participating in free demonstration rides of electric mobility devices (the “Vehicles”) provided by Ryddo LLC, a California limited liability company, state that I have read and understood and hereby expressly accept and agree to the following:',
  sections: [
    {
      id: 'risk-of-personal-injury',
      title: '1. Risk of Personal Injury.',
      content: 'I understand that the risks of riding the Vehicles are numerous and include, but are not limited to, the following: DEATH, PARALYSIS, HEAD INJURIES, BROKEN BONES, CUTS, SCRAPES, DAMAGE TO PROPERTIES, AND DAMAGE TO AND/OR INJURY TO OTHERS; falling, loss of control; encountering trees, limbs, brush, rocks, structures, ropes, barriers, and/or other man-made or naturally occurring obstacles; encountering unpredictable terrains such as varying steepness, mud, holes, cliffs, gravel, narrow trails, and/or lack of trails; negligence of other riders, persons, or vehicles; and/or negligent actions of Ryddo LLC, its employees, managers, officers, members or agents. I understand that risks from riding may include encountering bicycles, other electric mobility devices, motor vehicles, motorcycles and other motorized vehicles that may pose a hazard to me while riding the Vehicles. I understand that the risk of injury can increase due to inclement weather such as, but not limited to, snow, rain, hail, heat, and high winds. Injury can also occur due to inclement weather such as, but not limited to, heat exhaustion from extreme heat, frostbite from cold, and other injuries from rain, hail, snow, or other weather conditions.'
    },
    {
      id: 'conditions-and-representations',
      title: '2. Conditions and Representations.',
      type: 'numbered-list',
      items: [
        'I have made no misrepresentation to Ryddo LLC in any regard, including, but not limited to, age, abilities, or driver license status. I understand that a rider must be at least 16 years old and has a valid driver\'s license for the free demonstration rides of the Vehicles.',
        'All instructions for use of the Vehicles have been made clear to me and I fully understand how to use the Vehicles. I accept the Vehicles for use as is, and accept full responsibility for the care of the Vehicles while it is in my possession.',
        'I understand how to operate the Vehicles in a safe manner.',
        'I have a helmet, or one has been provided to me and I will wear a helmet at all times. I understand that wearing a helmet may decrease my risk of head injury.',
        'The Vehicles are working properly. I am physically and mentally able to ride the Vehicles and I am familiar with the riding and their physical and mental requirements and risks involved.',
        'I will read and follow all instructions and signs.',
        'I am aware of the costs associated with the Vehicles’ damage including but not limited to the price for each model of the Vehicles. I agree that I assume responsibility for a complete replacement for any and all damage done to the Vehicles due to my own misuse, accidents, other riders, or if lost or stolen, and/or any other circumstances.'
      ]
    },
    {
      id: 'release-of-liability',
      title: '3. Release of all liability (including negligence).',
      content: '<strong>I AGREE TO FULLY RELEASE AND DISCHARGE RYDDO LLC, ITS EMPLOYEES, managers, officers, members, and agents FROM ANY LIABILITY FOR ANY DAMAGES, INJURIES, OR CLAIMS, INCLUDING ANY INJURIES OR DAMAGES OCCURRING FROM ANY NEGLIGENCE (WHETHER ACTIVE, PASSIVE, SOLE, CONCURRENT OR GROSS), STRICT LIABILITY OR OTHER FAULT OF RYDDO LLC TO MYSELF OR ANY OTHER PERSON OR PROPERTY, AS A RESULT, MY PARTICIPATION IN THE FREE DEMONSTRATION RIDES OF THE VEHICLES. I FULLY UNDERSTAND AND AGREE TO RELEASE RYDDO LLC, ITS EMPLOYEES, managers, officers, members, and agents FOR THEIR NEGLIGENCE (WHETHER ACTIVE, PASSIVE, SOLE, CONCURRENT OR GROSS) IN CAUSING IN WHOLE OR IN PART ANY INJURY TO ME.</strong>'
    },
    {
      id: 'express-assumption-of-risks',
      title: '4. Express Assumption of Risks.',
      content: '<strong>I EXPRESSLY ASSUME ALL DANGERS INCIDENTAL TO, AND RISK OF LOSS, DAMAGE, OR INJURY OCCURRING AS A RESULT OF, PARTICIPATING IN THE FREE DEMONSTRATION RIDES OF THE VEHICLES, INCLUDING BUT NOT LIMITED TO THE RISK OF RYDDO LLC’S NEGLIGENCE (WHETHER ACTIVE, PASSIVE, SOLE, CONCURRENT OR GROSS).</strong>'
    },
    {
      id: 'promise-not-to-sue',
      title: '5. Promise Not to Sue and Hold Harmless.',
      content: '<strong>I AGREE NO LAWSUIT WILL BE FILED BY ME OR ON MY BEHALF AGAINST RYDDO LLC, ITS EMPLOYEES, managers, officers, members, OR agents as</strong> a result of my participation in the free demonstration rides of the Vehicles. If I do file a lawsuit, I agree to pay any attorney fees, costs, or judgments incurred by Ryddo LLC, its employees, managers, officers, members, or agents even if Ryddo LLC, its employees, managers, officers, members, or agents are found negligent. I further agree to indemnify Ryddo LLC, its employees, managers, officers, members, and agents from any liability and hold them harmless for any damages, injuries, judgments, or lawsuits, including any attorney’s fees and costs incurred by Ryddo LLC, its employees, managers, officers, members, and agents as a result of my participation in free demonstration rides of the Vehicles or any lawsuits resulting from such participation. <strong>I AGREE MY OBLIGATION TO INDEMNIFY AND HOLD RYDDO LLC, ITS EMPLOYEES, managers, officers, members, AND agents HARMLESS APPLIES EVEN IF RYDDO LLC, ITS EMPLOYEES, managers, officers, members OR agents ARE NEGLIGENT (WHETHER ACTIVE, PASSIVE, SOLE, CONCURRENT OR GROSS).</strong> I understand this is a contract, which limits my legal right, and it is binding upon me, my heirs, and my legal representative. If portions of this agreement are invalid, it is agreed the remaining portion will remain intact and enforceable. By signing the Release of Liability, the undersigned acknowledges he/she fully read and understands the above and foregoing.'
    },
    {
      id: 'photography-and-video-release',
      title: '6. Photography and Video Release.',
      content: 'I grant Ryddo LLC, its employees, managers, officers, members, or agents the right to take photographs and/or videos of me while engaged in the use of the Vehicles and further grant the publication of same on company\'s website or social media for the purpose of publicity, illustration, or advertising and expect no compensation.'
    }
  ],
  minorsSection: {
    title: 'Minors: Minimum age 16 years old.',
    description: 'Prospective participants under the age of 18 years are required to have a parent or legal guardian read and also sign this Release. The parent and the participant under 18 have read, understand, and agree to comply with this release.',
    agreement: 'BY SIGNING THIS DOCUMENT, THE PARENT OR LEGAL GUARDIAN AGREES TO EACH OF THE PROVISIONS ABOVE INCLUDING TO INDEMNIFY AND HOLD RYDDO LLC, ITS EMPLOYEES, managers, officers, members, and agents harmless from ANY AND ALL CLAIMS BROUGHT BY THE PARTICIPANT UNDER 18 OR RESULTING FROM THE PARTICIPANT UNDER 18’S ACTIONS, REGARDLESS OF THE NEGLIGENCE (WHETHER ACTIVE, PASSIVE, SOLE, CONCURRENT OR GROSS) OF RYDDO LLC, ITS EMPLOYEES, managers, officers, members OR agents.'
  }
};