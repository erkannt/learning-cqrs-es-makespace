import * as RA from 'fp-ts/ReadonlyArray'
import { pipe } from 'fp-ts/lib/function'
import { PracticalScheduled } from '../../events/practical-scheduled'
import { renderAvailablePracticals } from './render-available-practicals'
import { renderPage } from './render-page'

const availablePracticals = (events: ReadonlyArray<PracticalScheduled>) =>
  pipe(
    events,
    RA.map(event => ({
      title: event.title,
      freeSlots: event.capacity,
      date: event.date,
      duration: event.duration,
    })),
  )

type Ports = {
  getHistory: ReadonlyArray<PracticalScheduled>
}

export const home = (ports: Ports) => pipe(ports.getHistory, availablePracticals, renderAvailablePracticals, renderPage)
