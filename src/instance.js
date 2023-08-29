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
      this.loopItem = null;
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

    LoadDataFromJSON(json) {
      this.items = JSON.parse(json);
    }

    _DoForEachTrigger(eventSheetManager, currentEvent, solModifiers, oldFrame, newFrame) {
      eventSheetManager.PushCopySol(solModifiers);
      currentEvent.Retrigger(oldFrame, newFrame);
      eventSheetManager.PopSol(solModifiers)
    }

    LoopQueue(popItems) {
      const runtime = this._runtime;
      const eventSheetManager = runtime.GetEventSheetManager();
      const currentEvent = runtime.GetCurrentEvent();
      const solModifiers = currentEvent.GetSolModifiers();
      const eventStack = runtime.GetEventStack();
      const oldFrame = eventStack.GetCurrentStackFrame();
      const newFrame = eventStack.Push(currentEvent);
      const loopStack = eventSheetManager.GetLoopStack();
      const loop = loopStack.Push();

      runtime.SetDebuggingEnabled(false); 

      for(let i = 0; i < this.items.length; i++) {
        
        this.loopItem = popItems ? this.Pop() : this.items[i].value;
        loop.SetIndex(i);
        this._DoForEachTrigger(eventSheetManager, currentEvent, solModifiers, oldFrame, newFrame);
      }

      runtime.SetDebuggingEnabled(true);
      eventStack.Pop();
      loopStack.Pop();
      return false;
    }

    LoopItem() {
      return this.loopItem;
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
