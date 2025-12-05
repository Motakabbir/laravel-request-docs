<?php

namespace Rakutentech\LaravelRequestDocs;

/**
 * Parse custom LRD annotations from PHPDoc comments
 */
class DocBlockParser
{
    /**
     * Parse @LRDresponse annotations
     * Format: @LRDresponse 200 {"id": 1, "name": "John"}
     *
     * @return array<int, array{status_code: int, description: string, schema: array, examples?: array}>
     */
    public function parseResponseSchemas(string $docBlock): array
    {
        $schemas = [];
        
        // Match @LRDresponse with status code and JSON schema (supports multi-line)
        $pattern = '/@LRDresponse\s+(\d+)\s+({[\s\S]*?}(?=\s*(?:@|\*\/|$)))/';
        
        if (preg_match_all($pattern, $docBlock, $matches, PREG_SET_ORDER)) {
            foreach ($matches as $match) {
                $statusCode = (int) $match[1];
                $jsonString = trim($match[2]);
                
                $schema = $this->parseJson($jsonString);
                
                if ($schema !== null) {
                    $schemas[] = [
                        'status_code' => $statusCode,
                        'description' => $this->getStatusDescription($statusCode),
                        'schema' => $schema,
                    ];
                }
            }
        }
        
        return $schemas;
    }

    /**
     * Parse @LRDexample annotations
     * Format: @LRDexample createUser {"name": "John", "email": "john@example.com"}
     *
     * @return array<string, array{name: string, summary?: string, value: array}>
     */
    public function parseExamples(string $docBlock): array
    {
        $examples = [];
        
        // Match @LRDexample with name and JSON value
        $pattern = '/@LRDexample\s+(\w+)\s+({[\s\S]*?}(?=\s*(?:@|\*\/|$)))/';
        
        if (preg_match_all($pattern, $docBlock, $matches, PREG_SET_ORDER)) {
            foreach ($matches as $match) {
                $name = $match[1];
                $jsonString = trim($match[2]);
                
                $value = $this->parseJson($jsonString);
                
                if ($value !== null) {
                    $examples[$name] = [
                        'name' => $name,
                        'value' => $value,
                    ];
                }
            }
        }
        
        return $examples;
    }

    /**
     * Parse @LRDerror annotations
     * Format: @LRDerror 422 {"message": "Validation failed", "errors": {...}}
     *
     * @return array<int, array{status_code: int, description: string, schema: array}>
     */
    public function parseErrorSchemas(string $docBlock): array
    {
        $errors = [];
        
        // Match @LRDerror with status code and JSON schema
        $pattern = '/@LRDerror\s+(\d+)\s+({[\s\S]*?}(?=\s*(?:@|\*\/|$)))/';
        
        if (preg_match_all($pattern, $docBlock, $matches, PREG_SET_ORDER)) {
            foreach ($matches as $match) {
                $statusCode = (int) $match[1];
                $jsonString = trim($match[2]);
                
                $schema = $this->parseJson($jsonString);
                
                if ($schema !== null) {
                    $errors[] = [
                        'status_code' => $statusCode,
                        'description' => $this->getStatusDescription($statusCode),
                        'schema' => $schema,
                    ];
                }
            }
        }
        
        return $errors;
    }

    /**
     * Parse @LRDenum annotations
     * Format: @LRDenum status pending|approved|rejected Description here
     *
     * @return array<string, array{field: string, values: array<string>, description?: string}>
     */
    public function parseEnums(string $docBlock): array
    {
        $enums = [];
        
        // Match @LRDenum with field name, pipe-separated values, and optional description
        $pattern = '/@LRDenum\s+(\w+)\s+([\w|]+)(?:\s+(.+))?$/m';
        
        if (preg_match_all($pattern, $docBlock, $matches, PREG_SET_ORDER)) {
            foreach ($matches as $match) {
                $field = $match[1];
                $valuesString = $match[2];
                $description = $match[3] ?? '';
                
                $values = explode('|', $valuesString);
                $values = array_map('trim', $values);
                
                $enums[$field] = [
                    'field' => $field,
                    'values' => $values,
                    'description' => trim($description),
                ];
            }
        }
        
        return $enums;
    }

    /**
     * Parse @LRDdeprecated annotation
     * Format: @LRDdeprecated Use /api/v2/users instead
     *
     * @return array{deprecated: bool, message: string}|null
     */
    public function parseDeprecation(string $docBlock): ?array
    {
        // Match @LRDdeprecated with optional message
        $pattern = '/@LRDdeprecated(?:\s+(.+))?$/m';
        
        if (preg_match($pattern, $docBlock, $matches)) {
            return [
                'deprecated' => true,
                'message' => trim($matches[1] ?? 'This endpoint is deprecated'),
            ];
        }
        
        return null;
    }

    /**
     * Parse JSON string, handling common formatting issues
     */
    private function parseJson(string $jsonString): ?array
    {
        // Remove comment markers and extra whitespace
        $jsonString = preg_replace('/^\s*\*\s*/m', '', $jsonString);
        $jsonString = trim($jsonString);
        
        // Try to decode JSON
        $decoded = json_decode($jsonString, true);
        
        if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
            return $decoded;
        }
        
        return null;
    }

    /**
     * Get HTTP status description
     */
    private function getStatusDescription(int $statusCode): string
    {
        $descriptions = [
            200 => 'OK',
            201 => 'Created',
            202 => 'Accepted',
            204 => 'No Content',
            400 => 'Bad Request',
            401 => 'Unauthorized',
            403 => 'Forbidden',
            404 => 'Not Found',
            422 => 'Unprocessable Entity',
            429 => 'Too Many Requests',
            500 => 'Internal Server Error',
            502 => 'Bad Gateway',
            503 => 'Service Unavailable',
        ];
        
        return $descriptions[$statusCode] ?? 'Response';
    }
}
