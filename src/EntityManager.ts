import { Entity, clearNotify } from './Entity'
import { Component } from './Component'
import { Query, hasAll } from './Query'

export class EntityManager {
  private changed: Entity[] = []
  private removed: Entity[] = []

  private queries: Record<string, Query> = {
    '': new Query(() => true, [])
  }

  create () {
    return new Entity(this.scheduleUpdate)
  }

  query (...components: Component<any>[]): readonly Entity[] {
    const queryId = getQueryId(components)
    if (!this.queries[queryId]) {
      this.queries[queryId] = new Query(
        hasAll(components),
        this.queries[''].entities
      )
    }
    return this.queries[queryId].entities
  }

  queryOne (...components: Component<any>[]): Entity | undefined {
    return this.query(...components)[0]
  }

  scheduleUpdate = (entity: Entity) => this.changed.push(entity)

  scheduleRemove (entity: Entity) {
    this.removed.push(entity)
  }

  processUpdates () {
    for (const query of Object.values(this.queries)) {
      this.changed.forEach(entity => query.onChange(entity))
      this.removed.forEach(entity => query.onRemove(entity))
    }
    this.changed.forEach(clearNotify)
    this.changed.length = 0
    this.removed.forEach(clearNotify)
    this.removed.length = 0
  }
}

function getQueryId (components: Component<any>[]) {
  return components.sort().join('+')
}