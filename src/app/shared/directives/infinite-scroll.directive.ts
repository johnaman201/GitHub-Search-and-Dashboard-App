import { Directive, ElementRef, inject, input, OnDestroy, OnInit, output } from "@angular/core";

@Directive({
    selector: '[appInfiniteScroll]',
    standalone: true
})
export class InfiniteScrollDirective implements OnInit, OnDestroy {

    readonly scrollThreshold = input<number>(0.8);
    readonly scrolledToEnd = output<void>();

    private readonly el = inject(ElementRef);
    private observer!: IntersectionObserver;
    
    ngOnInit(): void {
        this.observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    this.scrolledToEnd.emit();
                }
            },
            {
                threshold: this.scrollThreshold()
            }
        );

        this.observer.observe(this.el.nativeElement);
    }

    ngOnDestroy(): void {
        this.observer.disconnect();
    }
    
}