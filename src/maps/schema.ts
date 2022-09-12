import { SchemaDefinitionsResponse, SchemaPropertiesResponse, SchemaPropertyResponse, SchemaResponse } from '@/models/api/SchemaResponse'
import { MapFunction } from '@/services/Mapper'
import { resolveSchema } from '@/services/schemas/resolvers/schemas'
import { Schema, SchemaDefinitions, SchemaProperties, SchemaProperty } from '@/types/schemas'
import { mapEntries, mapSnakeToCamelCase } from '@/utilities'

export const mapSchemaResponseToSchema: MapFunction<SchemaResponse, Schema> = function(source: SchemaResponse): Schema {
  // eslint-disable-next-line camelcase, @typescript-eslint/no-unused-vars
  const { definitions, block_schema_references, properties, $ref, ...rest } = source

  const mapped: Schema = {
    ...mapSnakeToCamelCase({ ...rest }),
    properties: this.map('SchemaPropertiesResponse', properties, 'SchemaProperties'),
    definitions: this.map('SchemaDefinitionsResponse', definitions, 'SchemaDefinitions'),
    // blockSchemaReferences: this.map('BlockSchemaReferencesResponse', block_schema_references, 'BlockSchemaReferences'),
  }

  if ($ref) {
    mapped.$ref = $ref
  }

  return resolveSchema(mapped)
}

export const mapSchemaDefinitionsResponseToSchemaDefinitions: MapFunction<SchemaDefinitionsResponse, SchemaDefinitions> = function(source: SchemaDefinitionsResponse): SchemaDefinitions {
  return mapEntries(source, (key, value) => this.map('SchemaResponse', value, 'Schema'))
}

export const mapSchemaPropertiesResponseToSchemaProperties: MapFunction<SchemaPropertiesResponse, SchemaProperties> = function(source: SchemaPropertiesResponse): SchemaProperties {
  return mapEntries(source, (key, value) => this.map('SchemaPropertyResponse', value, 'SchemaProperty'))
}

export const mapSchemaPropertyResponseToSchemaProperty: MapFunction<SchemaPropertyResponse, SchemaProperty> = function(source: SchemaPropertyResponse): SchemaProperty {
  const { properties, $ref, ...rest } = source

  const mapped: SchemaProperty = {
    ...mapSnakeToCamelCase({ ...rest }),
    properties: this.map('SchemaPropertiesResponse', properties, 'SchemaProperties'),
  }

  if ($ref) {
    mapped.$ref = $ref
  }

  return mapped
}