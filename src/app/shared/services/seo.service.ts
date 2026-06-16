import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class SeoService {
  constructor(
    private titleService: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private doc: Document
  ) {}

  update(config: { title: string; description: string; url: string }): void {
    this.titleService.setTitle(config.title);
    this.meta.updateTag({ name: 'description', content: config.description });
    const canonical = this.doc.querySelector("link[rel='canonical']");
    canonical?.setAttribute('href', config.url);
  }
}
