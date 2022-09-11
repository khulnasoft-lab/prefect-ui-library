import { PToggle } from '@prefecthq/prefect-design'
import { PropertyComponentWithProps, SchemaPropertyService } from './SchemaPropertyService'
import { SchemaValue } from '@/types/schemas'

export class SchemaPropertyBoolean extends SchemaPropertyService {
  protected override request(value: SchemaValue): unknown {
    return value
  }

  protected override response(value: SchemaValue): unknown {
    if (typeof value === 'string') {
      if (value.toLowerCase() === 'true') {
        return true
      }

      if (value.toLowerCase() === 'false') {
        return false
      }
    }

    if (typeof value !== 'boolean') {
      return this.invalid()
    }

    return value
  }

  public readonly default = null

  public override get component(): PropertyComponentWithProps {
    return this.withProps(PToggle)
  }

}