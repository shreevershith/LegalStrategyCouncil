import * as React from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../lib/utils'

const AccordionContext = React.createContext({
  value: null,
  onValueChange: () => {},
})

const Accordion = React.forwardRef(({ type = 'single', className, children, ...props }, ref) => {
  const [value, setValue] = React.useState(null)

  const onValueChange = React.useCallback((newValue) => {
    if (type === 'single') {
      setValue(prev => prev === newValue ? null : newValue)
    }
  }, [type])

  return (
    <AccordionContext.Provider value={{ value, onValueChange }}>
      <div ref={ref} className={cn('space-y-2', className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  )
})
Accordion.displayName = 'Accordion'

const AccordionItem = React.forwardRef(({ className, value: itemValue, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('border-b border-border', className)}
      data-value={itemValue}
      {...props}
    >
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { itemValue })
        }
        return child
      })}
    </div>
  )
})
AccordionItem.displayName = 'AccordionItem'

const AccordionTrigger = React.forwardRef(({ className, children, itemValue, ...props }, ref) => {
  const context = React.useContext(AccordionContext)
  const isOpen = context.value === itemValue

  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        'flex w-full items-center justify-between py-4 text-left font-medium transition-all hover:underline',
        isOpen && '[&>svg]:rotate-180',
        className
      )}
      onClick={() => context.onValueChange(itemValue)}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
    </button>
  )
})
AccordionTrigger.displayName = 'AccordionTrigger'

const AccordionContent = React.forwardRef(({ className, children, itemValue, ...props }, ref) => {
  const context = React.useContext(AccordionContext)
  const isOpen = context.value === itemValue

  if (!isOpen) return null

  return (
    <div
      ref={ref}
      className={cn('overflow-hidden text-sm transition-all pb-4', className)}
      {...props}
    >
      {children}
    </div>
  )
})
AccordionContent.displayName = 'AccordionContent'

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
