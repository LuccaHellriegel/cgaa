import {
  HealthComponent,
  MovementComponent,
  RenderComponent,
  PathfindingComponent,
  AIComponent,
  CampComponent,
  PositionComponent,
  ScreenComponent,
  CameraComponent,
  AttackComponent,
} from "./Entity";
import { assertValue } from "./utils/assert";

export const WORLD_WIDTH = 4800;
export const WORLD_HEIGHT = 3600;

let entityId = 0;

export function nextEntityId() {
  entityId++;
  return entityId;
}

export class ComponentManager {
  public player = nextEntityId();

  public camera: CameraComponent = {
    position: { x: 0, y: 0 },
    smoothFactor: 0.1,
  };

  public screen: ScreenComponent = {
    viewportWidth: 0,
    viewportHeight: 0,
    worldWidth: WORLD_WIDTH,
    worldHeight: WORLD_HEIGHT,
  };

  public movement: ComponentContainer<MovementComponent> = {
    ids: [],
    components: [],
  };

  public health: ComponentContainer<HealthComponent> = {
    ids: [],
    components: [],
  };

  public render: ComponentContainer<RenderComponent> = {
    ids: [],
    components: [],
  };

  public pathfinding: ComponentContainer<PathfindingComponent> = {
    ids: [],
    components: [],
  };

  public ai: ComponentContainer<AIComponent> = {
    ids: [],
    components: [],
  };

  public camp: ComponentContainer<CampComponent> = {
    ids: [],
    components: [],
  };

  public attack: ComponentContainer<AttackComponent> = {
    ids: [],
    components: [],
  };

  public damage: { ids: number[]; targets: number[]; executed: boolean[] } = {
    ids: [],
    targets: [],
    executed: [],
  };

  public dead: { ids: number[] } = {
    ids: [],
  };

  public positions: ComponentContainer<PositionComponent> = {
    ids: [],
    components: [],
  };

  public visible: { ids: number[] } = {
    ids: [],
  };
}

interface ComponentContainer<T> {
  ids: number[];
  components: T[];
}

export function getByIdStrict<T>(
  container: ComponentContainer<T>,
  id: number
): T {
  const component = getById(container, id);
  return assertValue(component, `Component with id ${id} not found`);
}

export function getById<T>(
  container: ComponentContainer<T>,
  id: number
): T | null {
  const index = container.ids.indexOf(id);
  if (index === -1) {
    return null;
  }
  return container.components[index];
}
