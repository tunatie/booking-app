export const pageOrder = [
    'overview',
    'structure',
    'privacy-type',
    'location',
    'floor-plan',
    'stand-out',
    'amenities',
    'photos',
    'title',
    'description',
    'finish',
    'booking-settings',
    'guest-type',
    'price',
    'discount',
    'security',
    'receipt',
    'celebration'
];

// Define step boundaries
export const stepBoundaries = {
    step1: { start: 0, end: 4 }, // overview to floor-plan (5 pages)
    step2: { start: 5, end: 9 }, // stand-out to description (5 pages)
    step3: { start: 10, end: 17 } // finish to celebration (8 pages)
};

export function getNextPage(currentPage) {
    const currentIndex = pageOrder.indexOf(currentPage);
    if (currentIndex === -1 || currentIndex === pageOrder.length - 1) return null;
    return pageOrder[currentIndex + 1];
}

export function getPreviousPage(currentPage) {
    const currentIndex = pageOrder.indexOf(currentPage);
    if (currentIndex <= 0) return null;
    return pageOrder[currentIndex - 1];
}

export function getPageProgress(currentPage) {
    const currentIndex = pageOrder.indexOf(currentPage);
    if (currentIndex === -1) return { step1: '0', step2: '0', step3: '0' };

    // Calculate progress for each step
    let step1Progress = 0;
    let step2Progress = 0;
    let step3Progress = 0;

    // Step 1: overview to floor-plan (5 pages)
    if (currentIndex <= stepBoundaries.step1.end) {
        const pagesInStep = stepBoundaries.step1.end - stepBoundaries.step1.start + 1;
        const currentStepIndex = currentIndex - stepBoundaries.step1.start;
        step1Progress = Math.round((currentStepIndex / (pagesInStep - 1)) * 100);
    } else {
        step1Progress = 100;
    }

    // Step 2: stand-out to description (5 pages)
    if (currentIndex > stepBoundaries.step1.end && currentIndex <= stepBoundaries.step2.end) {
        step1Progress = 100;
        const pagesInStep = stepBoundaries.step2.end - stepBoundaries.step2.start + 1;
        const currentStepIndex = currentIndex - stepBoundaries.step2.start;
        step2Progress = Math.round((currentStepIndex / (pagesInStep - 1)) * 100);
    } else if (currentIndex > stepBoundaries.step2.end) {
        step1Progress = 100;
        step2Progress = 100;
    }

    // Step 3: finish to celebration (8 pages)
    if (currentIndex > stepBoundaries.step2.end && currentIndex <= stepBoundaries.step3.end) {
        step1Progress = 100;
        step2Progress = 100;
        const pagesInStep = stepBoundaries.step3.end - stepBoundaries.step3.start + 1;
        const currentStepIndex = currentIndex - stepBoundaries.step3.start;
        step3Progress = Math.round((currentStepIndex / (pagesInStep - 1)) * 100);
    } else if (currentIndex > stepBoundaries.step3.end) {
        step1Progress = 100;
        step2Progress = 100;
        step3Progress = 100;
    }

    return {
        step1: step1Progress.toString(),
        step2: step2Progress.toString(),
        step3: step3Progress.toString()
    };
} 