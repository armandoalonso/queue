function getInstanceJs(parentClass, scriptInterface, addonTriggers, C3) {
  return class extends parentClass {
    constructor(inst, properties) {
      super(inst);

      if (properties) {
      }

      this.items = [];
      this.dequeuedValue = null;
      this.lastItem = null;
      this.lastItemQueued = null;
    }

    Enqueue(value) {
      this.EnqueueWithPiority(value, 0);
    }

    EnqueueWithPiority(value, piority) {
      const item = { value: value, piority: piority };
      const index = this.items.findIndex((x) => x.piority < piority);
      if (index === -1) {
        this.items.push(item);
      } else {
        this.items.splice(index, 0, item);
      }
      this.lastItemQueued = item;
      this.Trigger(C3.Plugins.piranha305_queue.Cnds.OnItemQueued);
    }

    Dequeue() {
      if (this.Size() > 0) {
        this.dequeuedValue = this.items.shift().value;
        this.Trigger(C3.Plugins.piranha305_queue.Cnds.OnItemDequeued);

        if (this.IsEmpty()) {
          this.Trigger(C3.Plugins.piranha305_queue.Cnds.OnLastItemDequeued);
        }
      } 
    }

    Shuffle() {
      for (let i = this.Size() - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.items[i], this.items[j]] = [this.items[j], this.items[i]];
      }
    }

    LoopQueue(popItems) {

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

    OnItemQueued() {
      return true;
    }

    OnItemDequeued() {
      return true;
    }

    Size() {
      return this.items.length;
    }

    LastDequeuedValue() {
      return this.dequeuedValue;
    }

    Peek() {
      if (this.items.length > 0) {
        return this.items[0].value;
      }
      return -1;
    }

    PeekLast() {
      return this.items[this.items.length - 1].value;
    }

    Pop() {
      this.Dequeue();
      return this.dequeuedValue;
    }

    LastQueued() {
      if (this.lastItemQueued) {
        return this.lastItemQueued.value;
      }
      return -1;
    }

    AsJSON() {
      return JSON.stringify(this.items);
    }

    LoadFromJSON(json) {
      this.items = JSON.parse(json);
    }

    Release() {
      super.Release();
    }

    SaveToJson() {
      return {
        items: this.items,
      };
    }

    LoadFromJson(o) {
      this.items = o.items;
    }

    GetDebuggerProperties() {
      return [
        {
          title: "Queue",
          properties: [
            {
              name: "$Items",
              value: this.items.join(", ")
            },
            {
              name: "$Size",
              value: this.items.length,
            },
            {
              name: "$JSON",
              value: JSON.stringify(this.items),
            }
          ],
        },
      ];
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
