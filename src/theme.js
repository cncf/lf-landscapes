import { extendTheme } from "@chakra-ui/react"

const theme = extendTheme({
  styles: {
    global: {
      td: {
        whiteSpace: 'nowrap'
      },
      a: {
        color: 'blue.700'
      }
    }
  },
  components: {
    Spinner: {
      baseStyle: {
        color: 'blue.500'
      }
    }
  }
})

export default theme
