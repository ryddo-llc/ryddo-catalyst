'use client';

import React from 'react';
import { Link } from '~/components/link';
import type { AccordionItem, SubSection } from '~/lib/data/terms-conditions';
import { Button } from '~/vibes/soul/primitives/button';

interface Props {
  accordionItems: AccordionItem[];
}

function renderTitle(subsection: SubSection) {
  const { title, titleStyle } = subsection;
    
  switch (titleStyle) {
    case 'italic':
      return <em className="text-gray-900">{title}</em>;

    case 'normal':
      return <span className="text-gray-900">{title}</span>;
      
    default:
      return <strong className="text-gray-900">{title}</strong>;
  }
}

export function PrivacyPolicyContent({ accordionItems }: Props) {
  return (
    <div className="space-y-8">
      {accordionItems.map((item) => (
        <section className="space-y-4" key={item.id}>
          <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide">
            {item.title}
          </h2>
          
          {item.subsections ? (
            <div className="text-lg text-gray-700 leading-relaxed">
              {item.description ? (
                <p className="mb-4">{item.description}</p>
              ) : null}
              {item.subsections.map((subsection, index) => (
                <div className="mb-6" key={index}>
                  {(subsection.type === 'bullet' || (!subsection.type && !subsection.content)) ? (
                    <div>
                      <div className="flex items-start">
                        <span className="text-gray-900 mr-2">•</span>
                        <span className="text-gray-900">{subsection.title}</span>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {renderTitle(subsection)}
                      <span> </span>
                      {subsection.paragraphs ? (
                        <div>
                          {subsection.paragraphs.map((paragraph, pIndex) => (
                            <div className={pIndex > 0 ? 'mt-4' : ''} key={pIndex}>
                              {paragraph}
                              {subsection.links && pIndex === (subsection.paragraphs?.length || 0) - 1 && (
                                <span>
                                  <span> </span>
                                  {subsection.links.map((link, linkIndex) => (
                                    <span key={linkIndex}>
                                      <a 
                                        className={link.className || 'text-pink-600 hover:text-pink-700 underline'}
                                        href={link.href} 
                                      >
                                        {link.text}
                                      </a>
                                      {linkIndex < (subsection.links?.length || 0) - 1 && <span>, </span>}
                                    </span>
                                  ))}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span>
                          {subsection.contentWithLinks ? (
                            <>
                              {subsection.contentWithLinks.map((contentItem, itemIndex) => (
                                <span key={itemIndex}>
                                  {contentItem.type === 'text' && contentItem.content}
                                  {contentItem.type === 'link' && contentItem.link && (
                                    <a 
                                      className={contentItem.link.className || 'text-pink-600 hover:text-pink-700 underline'}
                                      href={contentItem.link.href}
                                    >
                                      {contentItem.link.text}
                                    </a>
                                  )}
                                </span>
                              ))}
                            </>
                          ) : (
                            <>
                              {subsection.content}
                              {subsection.links && (
                                <span>
                                  <span> </span>
                                  {subsection.links.map((link, linkIndex) => (
                                    <span key={linkIndex}>
                                      <a 
                                        className={link.className || 'text-pink-600 hover:text-pink-700 underline'}
                                        href={link.href} 
                                      >
                                        {link.text}
                                      </a>
                                      {linkIndex < (subsection.links?.length || 0) - 1 && <span>, </span>}
                                    </span>
                                  ))}
                                </span>
                              )}
                            </>
                          )}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-lg text-gray-700 leading-relaxed">
              {item.description ? (
                <p className="mb-4">{item.description}</p>
              ) : null}
              <div dangerouslySetInnerHTML={{ __html: item.content }} />
            </div>
          )}
        </section>
      ))}
      
      <div className="flex justify-start">
        <Link href="/contact/">
          <Button className="group" shape="pill" size="medium" variant="primary">
            <span className="text-white">Contact us</span>
            <span className="text-white opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out -ml-2 group-hover:ml-1 w-0 group-hover:w-auto overflow-hidden">→</span>
          </Button>
        </Link>
      </div>
    </div>
  );
} 