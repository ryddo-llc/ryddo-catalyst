'use client';

import { clsx } from 'clsx';
import { useState } from 'react';

export interface Step {
  number: string;
  description: string;
}

export interface HowItWorksProps {
  title: string;
  steps: Step[];
  className?: string;
  'aria-labelledby'?: string;
}

interface StepCardProps {
  number: string;
  description: string;
  isActive?: boolean;
  className?: string;
}

function StepCard({ number, description, isActive = false, className }: StepCardProps) {
  return (
    <div
      className={clsx(
        'flex items-center gap-3 rounded-[25px] p-3 transition-all md:gap-3 md:p-4',
        isActive ? 'bg-[rgb(59,105,172)]' : 'bg-transparent',
        className,
      )}
    >
      <span className="shrink-0 font-[family-name:var(--font-family-kanit)] text-4xl font-black italic text-white md:text-5xl lg:text-6xl">
        {number}
      </span>
      <span className="shrink-0 text-5xl font-extralight text-white md:text-6xl lg:text-7xl">
        |
      </span>
      <p className="flex-1 text-left font-[family-name:var(--font-family-body)] text-xs font-semibold italic leading-tight text-white md:text-sm lg:text-base">
        {description}
      </p>
    </div>
  );
}

// eslint-disable-next-line valid-jsdoc
/**
 * HowItWorks component displays Ryddo's ordering process with
 * interactive step navigation showing 2 steps at a time.
 *
 * This component supports various CSS variables for theming:
 *
 * ```css
 * :root {
 *   --font-family-body: Inter, sans-serif;
 *   --font-family-kanit: Kanit, sans-serif;
 * }
 * ```
 */
export function HowItWorks({
  'aria-labelledby': ariaLabelledBy = 'how-it-works',
  title,
  steps,
  className,
}: HowItWorksProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedStepIndex, setSelectedStepIndex] = useState(0);
  const stepsPerPage = 2;

  const currentSteps = steps.slice(currentPage * stepsPerPage, (currentPage + 1) * stepsPerPage);

  const handleStepClick = (stepIndex: number) => {
    const pageIndex = Math.floor(stepIndex / stepsPerPage);

    setCurrentPage(pageIndex);
    setSelectedStepIndex(stepIndex);
  };

  return (
    <div className={clsx('mx-auto mb-16 max-w-3xl md:mb-20 lg:mb-28', className)}>
      <div className="overflow-hidden rounded-[25px] bg-white p-1">
        <div className="rounded-[25px] bg-[rgb(164,206,246)] px-4 py-6 md:px-6 md:py-8 lg:px-8 lg:py-10">
          {/* Title */}
          <header className="mb-4 text-center md:mb-6">
            <h2
              className="font-[family-name:var(--font-family-body)] text-4xl font-extrabold text-white md:text-4xl lg:text-5xl"
              id={ariaLabelledBy}
            >
              {title}
            </h2>
          </header>

          {/* Steps Container */}
          <div className="mx-auto max-w-xl space-y-3 md:space-y-4">
            {currentSteps.map((step, index) => {
              const globalIndex = currentPage * stepsPerPage + index;

              return (
                <StepCard
                  description={step.description}
                  isActive={globalIndex === selectedStepIndex}
                  key={`${step.number}-${index}`}
                  number={step.number}
                />
              );
            })}
          </div>

          {/* Step Numbers Navigation */}
          <div className="mt-4 flex items-center justify-center gap-1 md:mt-6 md:gap-1">
            {steps.map((step, index) => (
              <div className="flex items-center gap-2 md:gap-3" key={index}>
                <button
                  className={clsx(
                    'rounded-full px-2 py-0.5 font-[family-name:var(--font-family-kanit)] text-base font-black italic transition-all md:px-3 md:py-1 md:text-lg',
                    index === selectedStepIndex
                      ? 'bg-blue-500 text-white'
                      : 'bg-transparent text-white hover:text-white/80',
                  )}
                  onClick={() => handleStepClick(index)}
                  type="button"
                >
                  {step.number}
                </button>
                {index < steps.length - 1 && (
                  <span className="font-[family-name:var(--font-family-kanit)] text-base font-black italic text-white md:text-lg">
                    /
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
