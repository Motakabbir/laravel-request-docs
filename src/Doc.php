<?php

namespace Rakutentech\LaravelRequestDocs;

use Illuminate\Contracts\Support\Arrayable;

/**
 * @codeCoverageIgnore
 */
/** @phpstan-ignore-next-line */
class Doc implements Arrayable
{
    /**
     * The URI pattern the route responds to.
     */
    private string $uri;

    /**
     * The list of HTTP methods the route responds to.
     * Most of the time contains only 1 HTTP method.
     * If a route is defined as `GET`, `HEAD` is always injected into this property.
     *
     * @var string[]
     */
    private array $methods;

    /**
     * The middlewares attached to the route.
     *
     * @var string[]
     */
    private array $middlewares;

    /**
     * The route controller short name.
     * Empty if the route action is a closure.
     */
    private string $controller;

    /**
     * The controller fully qualified name used for the route.
     * Empty if the route action is a closure.
     */
    private string $controllerFullPath;

    /**
     * The (Controller) method name of the route action.
     * Empty if the route action is a closure.
     */
    private string $method;

    /**
     * The HTTP method the route responds to.
     */
    private string $httpMethod;

    /**
     * The parsed validation rules.
     *
     * @var array<string, string[]>
     */
    private array $rules;

    /**
     * The additional description about this route.
     */
    private string $docBlock;

    /**
     * A list of HTTP response codes in string format.
     *
     * @var string[]
     */
    private array $responses;

    /**
     * A list of route path parameters, such as `/users/{id}`.
     *
     * @var array<string, string[]>
     */
    private array $pathParameters;

    /**
     * The group name of the route.
     */
    private string $group;

    /**
     * The group index of the group, determine the ordering.
     */
    private int $groupIndex;

    /**
     * Whether this route requires authentication.
     */
    private bool $requiresAuth;

    /**
     * Response schemas by status code.
     *
     * @var array<int, array{status_code: int, description: string, schema: array}>
     */
    private array $responseSchemas;

    /**
     * Request examples.
     *
     * @var array<string, array{name: string, value: array}>
     */
    private array $requestExamples;

    /**
     * Error response schemas.
     *
     * @var array<int, array{status_code: int, description: string, schema: array}>
     */
    private array $errorSchemas;

    /**
     * Enum values for fields.
     *
     * @var array<string, array{field: string, values: array<string>, description?: string}>
     */
    private array $enumValues;

    /**
     * Whether this route is deprecated.
     */
    private bool $isDeprecated;

    /**
     * Deprecation message.
     */
    private string $deprecationMessage;

    /**
     * @param  string[]  $methods
     * @param  string[]  $middlewares
     * @param  array<string, string[]>  $pathParameters
     * @param  array<string, string[]>  $rules
     */
    public function __construct(
        string $uri,
        array $methods,
        array $middlewares,
        string $controller,
        string $controllerFullPath,
        string $method,
        string $httpMethod,
        array $pathParameters,
        array $rules,
        string $docBlock
    ) {
        $this->uri = $uri;
        $this->methods = $methods;
        $this->middlewares = $middlewares;
        $this->controller = $controller;
        $this->controllerFullPath = $controllerFullPath;
        $this->method = $method;
        $this->httpMethod = $httpMethod;
        $this->pathParameters = $pathParameters;
        $this->rules = $rules;
        $this->docBlock = $docBlock;
        $this->responses = [];
        $this->requiresAuth = false;
        $this->responseSchemas = [];
        $this->requestExamples = [];
        $this->errorSchemas = [];
        $this->enumValues = [];
        $this->isDeprecated = false;
        $this->deprecationMessage = '';
    }

    public function getUri(): string
    {
        return $this->uri;
    }

    public function setUri(string $uri): void
    {
        $this->uri = $uri;
    }

    /**
     * @return string[]
     */
    public function getMethods(): array
    {
        return $this->methods;
    }

    /**
     * @param  string[]  $methods
     */
    public function setMethods(array $methods): void
    {
        $this->methods = $methods;
    }

    /**
     * @return string[]
     */
    public function getMiddlewares(): array
    {
        return $this->middlewares;
    }

    /**
     * @param  string[]  $middlewares
     */
    public function setMiddlewares(array $middlewares): void
    {
        $this->middlewares = $middlewares;
    }

    public function getController(): string
    {
        return $this->controller;
    }

    public function setController(string $controller): void
    {
        $this->controller = $controller;
    }

    public function getControllerFullPath(): string
    {
        return $this->controllerFullPath;
    }

    public function setControllerFullPath(string $controllerFullPath): void
    {
        $this->controllerFullPath = $controllerFullPath;
    }

    public function getMethod(): string
    {
        return $this->method;
    }

    public function setMethod(string $method): void
    {
        $this->method = $method;
    }

    public function getHttpMethod(): string
    {
        return $this->httpMethod;
    }

    public function setHttpMethod(string $httpMethod): void
    {
        $this->httpMethod = $httpMethod;
    }

    /**
     * @return array<string, string[]>
     */
    public function getRules(): array
    {
        return $this->rules;
    }

    /**
     * @param  array<string, string[]>  $rules
     */
    public function mergeRules(array $rules): void
    {
        $this->rules = array_merge(
            $this->rules,
            $rules,
        );
    }

    /**
     * @param  array<string, string[]>  $rules
     */
    public function setRules(array $rules): void
    {
        $this->rules = $rules;
    }

    public function getDocBlock(): string
    {
        return $this->docBlock;
    }

    public function setDocBlock(string $docBlock): void
    {
        $this->docBlock = $docBlock;
    }

    public function getGroup(): string
    {
        return $this->group;
    }

    public function setGroup(string $group): void
    {
        $this->group = $group;
    }

    public function getGroupIndex(): int
    {
        return $this->groupIndex;
    }

    public function setGroupIndex(int $groupIndex): void
    {
        $this->groupIndex = $groupIndex;
    }

    public function isClosure(): bool
    {
        return $this->controller === '';
    }

    /**
     * @return string[]
     */
    public function getResponses(): array
    {
        return $this->responses;
    }

    /**
     * @param  string[]  $responses
     */
    public function setResponses(array $responses): void
    {
        $this->responses = $responses;
    }

    /**
     * @return array<string, string[]>
     */
    public function getPathParameters(): array
    {
        return $this->pathParameters;
    }

    public function getRequiresAuth(): bool
    {
        return $this->requiresAuth;
    }

    public function setRequiresAuth(bool $requiresAuth): void
    {
        $this->requiresAuth = $requiresAuth;
    }

    public function clone(): self
    {
        return clone $this;
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        $result = [
            'uri' => $this->uri,
            'middlewares' => $this->middlewares,
            'controller' => $this->controller,
            'controller_full_path' => $this->controllerFullPath,
            'method' => $this->method,
            'http_method' => $this->httpMethod,
            'path_parameters' => $this->pathParameters,
            'rules' => $this->rules,
            'doc_block' => $this->docBlock,
            'responses' => $this->responses,
            'requires_auth' => $this->requiresAuth,
            'response_schemas'     => $this->responseSchemas,
            'request_examples'     => $this->requestExamples,
            'error_schemas'        => $this->errorSchemas,
            'enum_values'          => $this->enumValues,
            'is_deprecated'        => $this->isDeprecated,
            'deprecation_message'  => $this->deprecationMessage,
        ];

        if (isset($this->group)) {
            $result['group'] = $this->group;
        }

        if (isset($this->groupIndex)) {
            $result['group_index'] = $this->groupIndex;
        }

        return $result;
    }


    /**
     * @return array<int, array{status_code: int, description: string, schema: array}>
     */
    public function getResponseSchemas(): array
    {
        return $this->responseSchemas;
    }

    /**
     * @param  array<int, array{status_code: int, description: string, schema: array}>  $responseSchemas
     */
    public function setResponseSchemas(array $responseSchemas): void
    {
        $this->responseSchemas = $responseSchemas;
    }

    /**
     * @return array<string, array{name: string, value: array}>
     */
    public function getRequestExamples(): array
    {
        return $this->requestExamples;
    }

    /**
     * @param  array<string, array{name: string, value: array}>  $requestExamples
     */
    public function setRequestExamples(array $requestExamples): void
    {
        $this->requestExamples = $requestExamples;
    }

    /**
     * @return array<int, array{status_code: int, description: string, schema: array}>
     */
    public function getErrorSchemas(): array
    {
        return $this->errorSchemas;
    }

    /**
     * @param  array<int, array{status_code: int, description: string, schema: array}>  $errorSchemas
     */
    public function setErrorSchemas(array $errorSchemas): void
    {
        $this->errorSchemas = $errorSchemas;
    }

    /**
     * @return array<string, array{field: string, values: array<string>, description?: string}>
     */
    public function getEnumValues(): array
    {
        return $this->enumValues;
    }

    /**
     * @param  array<string, array{field: string, values: array<string>, description?: string}>  $enumValues
     */
    public function setEnumValues(array $enumValues): void
    {
        $this->enumValues = $enumValues;
    }

    public function getIsDeprecated(): bool
    {
        return $this->isDeprecated;
    }

    public function setIsDeprecated(bool $isDeprecated): void
    {
        $this->isDeprecated = $isDeprecated;
    }

    public function getDeprecationMessage(): string
    {
        return $this->deprecationMessage;
    }

    public function setDeprecationMessage(string $deprecationMessage): void
    {
        $this->deprecationMessage = $deprecationMessage;
    }
}
