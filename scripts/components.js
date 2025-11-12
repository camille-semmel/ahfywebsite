
export const load_header = () => load_component("header", "start")
export const load_footer = () => load_component("footer", "end")

/**
 * Load a component template and inject it into the target element.
 *
 * @param { string } name - Name of component file and ID of template (Must be the same)
 * @param { "start" | "end" | string } location - Injection mode - Start or End of body, else inject at ID given
 */
export function load_component(name, location) {
  return fetch(`components/_${name}.html`)
    .then(r => r.text())
    .then(html => {
      const tempWrapper = document.createElement("div")
      tempWrapper.innerHTML = html

      const template = tempWrapper.querySelector(`template#${name}`)
        const clone = template.content.cloneNode(true)

      if (location === "start") {
        let target = document.body
        target.prepend(clone)
      } else if (location === "end") {
        let target = document.body
        target.append(clone)
      } else {
        let target = document.getElementById(location)
        target.replaceChildren(clone)
      }
  })
}

