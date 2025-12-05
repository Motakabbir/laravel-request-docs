<?php

namespace Rakutentech\LaravelRequestDocs;

/**
 * Generate code snippets in multiple languages
 */
class CodeSnippetGenerator
{
    public function generateCurl(Doc $doc, string $baseUrl): string
    {
        $method = strtoupper($doc->getHttpMethod());
        $uri = $doc->getUri();
        $url = rtrim($baseUrl, '/') . '/' . ltrim($uri, '/');
        
        $snippet = "curl -X {$method} \\\n";
        $snippet .= "  '{$url}' \\\n";
        $snippet .= "  -H 'Content-Type: application/json' \\\n";
        $snippet .= "  -H 'Accept: application/json'";
        
        if ($doc->getRequiresAuth()) {
            $snippet .= " \\\n  -H 'Authorization: Bearer {token}'";
        }
        
        // Add example body if available
        $examples = $doc->getRequestExamples();
        if (!empty($examples) && in_array($method, ['POST', 'PUT', 'PATCH'])) {
            $firstExample = reset($examples);
            $body = json_encode($firstExample['value'], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
            $snippet .= " \\\n  -d '" . str_replace("'", "\\'", $body) . "'";
        }
        
        return $snippet;
    }
    
    public function generateJavaScript(Doc $doc, string $baseUrl): string
    {
        $method = strtoupper($doc->getHttpMethod());
        $uri = $doc->getUri();
        $url = rtrim($baseUrl, '/') . '/' . ltrim($uri, '/');
        
        $snippet = "fetch('{$url}', {\n";
        $snippet .= "  method: '{$method}',\n";
        $snippet .= "  headers: {\n";
        $snippet .= "    'Content-Type': 'application/json',\n";
        $snippet .= "    'Accept': 'application/json'";
        
        if ($doc->getRequiresAuth()) {
            $snippet .= ",\n    'Authorization': 'Bearer {token}'";
        }
        
        $snippet .= "\n  }";
        
        // Add example body
        $examples = $doc->getRequestExamples();
        if (!empty($examples) && in_array($method, ['POST', 'PUT', 'PATCH'])) {
            $firstExample = reset($examples);
            $body = json_encode($firstExample['value'], JSON_PRETTY_PRINT);
            $snippet .= ",\n  body: JSON.stringify(" . $body . ")";
        }
        
        $snippet .= "\n})\n";
        $snippet .= ".then(response => response.json())\n";
        $snippet .= ".then(data => console.log(data))\n";
        $snippet .= ".catch(error => console.error('Error:', error));";
        
        return $snippet;
    }
    
    public function generatePhp(Doc $doc, string $baseUrl): string
    {
        $method = strtolower($doc->getHttpMethod());
        $uri = $doc->getUri();
        $url = rtrim($baseUrl, '/') . '/' . ltrim($uri, '/');
        
        $snippet = "use Illuminate\\Support\\Facades\\Http;\n\n";
        $snippet .= "\$response = Http::";
        
        if ($doc->getRequiresAuth()) {
            $snippet .= "withToken('{token}')\n    ->";
        }
        
        $snippet .= "{$method}('{$url}'";
        
        // Add example body
        $examples = $doc->getRequestExamples();
        if (!empty($examples) && in_array(strtoupper($method), ['POST', 'PUT', 'PATCH'])) {
            $firstExample = reset($examples);
            $body = var_export($firstExample['value'], true);
            $snippet .= ", {$body}";
        }
        
        $snippet .= ");\n\n";
        $snippet .= "\$data = \$response->json();";
        
        return $snippet;
    }
    
    public function generatePython(Doc $doc, string $baseUrl): string
    {
        $method = strtolower($doc->getHttpMethod());
        $uri = $doc->getUri();
        $url = rtrim($baseUrl, '/') . '/' . ltrim($uri, '/');
        
        $snippet = "import requests\n\n";
        $snippet .= "url = '{$url}'\n";
        $snippet .= "headers = {\n";
        $snippet .= "    'Content-Type': 'application/json',\n";
        $snippet .= "    'Accept': 'application/json'";
        
        if ($doc->getRequiresAuth()) {
            $snippet .= ",\n    'Authorization': 'Bearer {token}'";
        }
        
        $snippet .= "\n}\n\n";
        
        // Add example body
        $examples = $doc->getRequestExamples();
        if (!empty($examples) && in_array(strtoupper($method), ['POST', 'PUT', 'PATCH'])) {
            $firstExample = reset($examples);
            $body = json_encode($firstExample['value'], JSON_PRETTY_PRINT);
            $snippet .= "data = {$body}\n\n";
            $snippet .= "response = requests.{$method}(url, headers=headers, json=data)\n";
        } else {
            $snippet .= "response = requests.{$method}(url, headers=headers)\n";
        }
        
        $snippet .= "print(response.json())";
        
        return $snippet;
    }
}
