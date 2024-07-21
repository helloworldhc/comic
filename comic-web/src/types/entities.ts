export interface Library {
  id: number,
  name: string,
  path?: string,
  cover?: string,
  comicCount: number,
  lastVisitTime?: string
}

export interface Comic {
  id: number,
  name: string,
  size?: number,
  cover: string,
  pageCount: number,
  readingProgress: number,
  finished: number,
  lastTime?: string,
  createTime: string
}

export interface Property {
  name: string,
  values: string[],
}

export type ComicDetail = {
  name: string,
  authors: string[],
  properties: Property[],
}