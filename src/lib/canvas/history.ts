const MAX_HISTORY = 50;

export type PageHistory = {
  past: string[];
  future: string[];
};

export class PageHistoryManager {
  private histories = new Map<string, PageHistory>();
  private activePageId: string | null = null;
  private gestureSnapshot: string | null = null;

  setActivePage(pageId: string | null) {
    this.activePageId = pageId;
    this.gestureSnapshot = null;
  }

  private getHistory(pageId: string): PageHistory {
    const existing = this.histories.get(pageId);
    if (existing) return existing;
    const created: PageHistory = { past: [], future: [] };
    this.histories.set(pageId, created);
    return created;
  }

  canUndo(pageId?: string | null): boolean {
    const id = pageId ?? this.activePageId;
    if (!id) return false;
    return this.getHistory(id).past.length > 0;
  }

  canRedo(pageId?: string | null): boolean {
    const id = pageId ?? this.activePageId;
    if (!id) return false;
    return this.getHistory(id).future.length > 0;
  }

  beginGesture(snapshot: string) {
    if (!this.gestureSnapshot) {
      this.gestureSnapshot = snapshot;
    }
  }

  commitGesture(pageId: string, currentSnapshot: string) {
    if (this.gestureSnapshot) {
      this.pushSnapshot(pageId, this.gestureSnapshot);
      this.gestureSnapshot = null;
    }
    this.discardFuture(pageId);
    void currentSnapshot;
  }

  pushSnapshot(pageId: string, snapshot: string) {
    const history = this.getHistory(pageId);
    const last = history.past[history.past.length - 1];
    if (last === snapshot) return;

    history.past.push(snapshot);
    if (history.past.length > MAX_HISTORY) {
      history.past.shift();
    }
    history.future = [];
  }

  discardFuture(pageId: string) {
    this.getHistory(pageId).future = [];
  }

  undo(pageId: string, currentSnapshot: string): string | null {
    const history = this.getHistory(pageId);
    if (history.past.length === 0) return null;

    history.future.unshift(currentSnapshot);
    const previous = history.past.pop();
    return previous ?? null;
  }

  redo(pageId: string, currentSnapshot: string): string | null {
    const history = this.getHistory(pageId);
    if (history.future.length === 0) return null;

    history.past.push(currentSnapshot);
    const next = history.future.shift();
    return next ?? null;
  }

  clearPage(pageId: string) {
    this.histories.delete(pageId);
    if (this.activePageId === pageId) {
      this.gestureSnapshot = null;
    }
  }
}
