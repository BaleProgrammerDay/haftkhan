import { useEffect, useMemo, useState } from "react";
import { EventBus } from "../../game/EventBus";

type Vector = { x: number; y: number; r: number };

class ChaosManager {
  private active = false;
  private offsets: Record<string, Vector> = {};
  private velocities: Record<string, Vector> = {};
  private raf: number | null = null;
  private lastT = 0;
  private listeners = new Set<() => void>();

  constructor() {
    EventBus.on("audio-chaos-start", this.start);
    EventBus.on("audio-chaos-stop", this.stop);
  }

  public subscribe = (fn: () => void) => {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  };

  private notify = () => {
    this.listeners.forEach((fn) => fn());
  };

  public isActive = () => this.active;

  public getOffset = (id: string): Vector => {
    return this.offsets[id] || { x: 0, y: 0, r: 0 };
  };

  public ensureVelocity = (id: string) => {
    if (!this.velocities[id]) {
      this.velocities[id] = {
        x: (Math.random() * 2 - 1) * 24 * (Math.random() * 3 + 1),
        y: (Math.random() * 2 - 1) * 16 * (Math.random() * 3 + 1),
        r: (Math.random() * 2 - 1) * 2,
      };
      if (!this.offsets[id]) this.offsets[id] = { x: 0, y: 0, r: 0 };
    }
  };

  public clearItem = (id: string) => {
    delete this.velocities[id];
    delete this.offsets[id];
  };

  private loop = (t: number) => {
    const dt = Math.min(32, t - this.lastT);
    this.lastT = t;

    Object.keys(this.velocities).forEach((key) => {
      const v = this.velocities[key];
      const o = this.offsets[key] || { x: 0, y: 0, r: 0 };
      o.x += v.x * (dt / 16);
      o.y += v.y * (dt / 16);
      o.r += v.r * (dt / 16);
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (o.x > w) o.x = -w * 0.25;
      if (o.x < -w) o.x = w * 0.25;
      if (o.y > h) o.y = -h * 0.25;
      if (o.y < -h) o.y = h * 0.25;
      this.offsets[key] = o;
    });

    this.notify();
    this.raf = requestAnimationFrame(this.loop);
  };

  private start = () => {
    if (this.active) return;
    this.active = true;
    this.lastT = performance.now();
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = requestAnimationFrame(this.loop);
    this.notify();
  };

  private stop = () => {
    if (!this.active) return;
    this.active = false;
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = null;
    this.offsets = {};
    this.velocities = {};
    this.notify();
  };
}

const chaos = new ChaosManager();

export function useChaosContainer() {
  const [active, setActive] = useState(chaos.isActive());
  useEffect(() => {
    return chaos.subscribe(() => setActive(chaos.isActive()));
  }, []);
  const style = useMemo(() => {
    return active
      ? {
          position: "relative" as const,
          zIndex: 1000 as const,
          overflow: "visible" as const,
        }
      : {};
  }, [active]);
  return { active, style };
}

export function useChaosItem(id: string) {
  const [, setTick] = useState(0);
  useEffect(() => {
    return chaos.subscribe(() => setTick((t) => (t + 1) % 1000000));
  }, []);
  const active = chaos.isActive();
  if (active) chaos.ensureVelocity(id);
  else chaos.clearItem(id);
  const o = chaos.getOffset(id);
  const style = active
    ? {
        transform: `translate(${o.x}px, ${o.y}px) rotate(${o.r}deg)`,
        transition: "none",
      }
    : {
        transform: `translate(0px, 0px) rotate(0deg)`,
        transition: "transform 250ms ease",
      };
  return { active, style };
}


