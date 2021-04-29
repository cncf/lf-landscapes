import { extendTheme } from "@chakra-ui/react"

const theme = extendTheme({
  styles: {
    global: {
      td: {
        whiteSpace: 'nowrap'
      },
      a: {
        color: 'blue.600'
      }
    }
  },
  components: {
    Spinner: {
      baseStyle: {
        color: 'blue.500'
      }
    },
    Link: {
      baseStyle: {
        color: 'blue.600'
      }
    }
  }
})

export default theme
