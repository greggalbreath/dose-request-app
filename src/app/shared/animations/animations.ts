import { animate, AnimationEntryMetadata, state, style, transition, trigger } from '@angular/core';

export const fadeInOut: AnimationEntryMetadata = trigger('fadeInOut', [
    state('inactive', style({
        display: 'none',
        opacity: '0',
        height: 0,
        'pointer-events': 'none'
    })),
    state('void', style({
        display: 'none',
        opacity: '0',
        height: 0,
        'pointer-events': 'none'
    })),
    state('active', style({
        opacity: '1',
        height: '*',
        'pointer-events': 'auto'
    })),
    transition('inactive => active', animate('300ms linear')),
    transition('void => active', animate('300ms linear')),
    transition('active => *', animate('300ms linear'))
]);