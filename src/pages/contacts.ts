import { dom, fdom } from "mve-dom";
import { renderMobileView } from "../onlyMobile";
import { arrayCountCreateWith, groupToMap } from "wy-helper";
import { faker } from "@faker-js/faker";
import { renderArray, renderArrayKey } from "mve-helper";

export default function () {
  renderMobileView(function ({
    height
  }) {

    type Person = {
      name: string
      phone: string
    }

    const persons: Person[] = []
    for (let i = 0; i < 200; i++) {
      let name = ''
      while (true) {
        name = faker.person.fullName()
        if (!persons.find(v => v.name == name)) {
          break
        }
      }
      persons.push({
        name,
        phone: faker.phone.number()
      })
    }
    persons.sort((a, b) => {
      return a.name.localeCompare(b.name)
    })

    const personsGroupMap = groupToMap(persons, person => person.name[0])
    const personsGroups: PersonGroup[] = []
    personsGroupMap.forEach(function (value, key) {
      personsGroups.push({
        firstKey: key,
        list: value
      })
    })
    personsGroups.sort((a, b) => {
      return a.firstKey.localeCompare(b.firstKey)
    })

    type PersonGroup = {
      firstKey: string,
      list: Person[]
    }
    fdom.div({
      s_height() {
        return height() + 'px'
      },
      className: 'overflow-x-auto',
      children() {
        fdom.table({
          className: 'daisy-table daisy-table-pin-rows bg-base-200',
          children() {
            renderArrayKey<PersonGroup, string>(() => personsGroups, v => v.firstKey, function (getRow, getIndex, key) {

              fdom.thead({
                children() {
                  fdom.tr({
                    children() {
                      dom.th().renderTextContent(key)
                    }
                  })
                }
              })
              fdom.tbody({
                children() {
                  renderArrayKey<Person, string>(() => getRow().list, v => v.name, function (getPerson, getIndex, key) {

                    fdom.tr({
                      children() {
                        dom.td().renderTextContent(key)
                      }
                    })
                  })
                }
              })
            })
          }
        })
      }
    })

  })
}