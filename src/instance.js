function getInstanceJs(parentClass, scriptInterface, addonTriggers, C3) {
  return class extends parentClass {
    constructor(inst, properties) {
      super(inst);

      if (properties) {
      }

      this.items = [];
      this.dequeuedValue = null;
    }

    Enqueue(value) {
      this.EnqueueWithPiority(value, 0);
    }

    EnqueueWithPiority(value, piority) {
      const item = { value: value, piority: piority };
      const index = this.items.findIndex((x) => x.piority < piority);
      if (index === -1) {
        this.items.push(item);
      }
      this.items.splice(index, 0, item);
    }

    Dequeue() {
      if (this.Size() > 0) {
        this.dequeuedValue = this.items.shift().value;
        if (this.IsEmpty()) {
          this.Trigger(C3.Plugin.piranha305_queue.Cnds.OnLastItemDequeued);
        }
      } 
    }

    Shuffle() {
      for (let i = this.Size() - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.items[i], this.items[j]] = [this.items[j], this.items[i]];
      }
    }

    Clear() {
      this.items = [];
    }

    IsEmpty() {
      return this.items.length === 0;
    }

    HasItems() {
      return this.items.length > 0;
    }

    OnLastItemDequeued() {
      return true;
    }

    Size() {
      return this.items.length;
    }

    LastDequeuedValue() {
      return this.dequeuedValue;
    }

    Peek() {
      return this.items[0].value;
    }

    Pop() {
      this.Dequeue();
      return this.dequeuedValue;
    }

    Release() {
      super.Release();
    }

    SaveToJson() {
      return {
        // data to be saved for savegames
      };
    }

    LoadFromJson(o) {
      // load state for savegames
    }

    Trigger(method) {
      super.Trigger(method);
      const addonTrigger = addonTriggers.find((x) => x.method === method);
      if (addonTrigger) {
        this.GetScriptInterface().dispatchEvent(new C3.Event(addonTrigger.id));
      }
    }

    GetScriptInterfaceClass() {
      return scriptInterface;
    }
  };
}
