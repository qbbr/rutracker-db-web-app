<?php

declare(strict_types=1);

namespace App\EventSubscriber;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\Exception\HttpException;

class ExceptionToJsonResponseSubscriber implements EventSubscriberInterface
{
    #[\Override]
    public static function getSubscribedEvents(): array
    {
        return [
            'kernel.exception' => 'onKernelException',
        ];
    }

    public function onKernelException(
        ExceptionEvent $event,
    ): void {
        $exception = $event->getThrowable();
        $statusCode = $this->getStatusCodeFromException($exception);
        $data = [
            'code' => $statusCode,
            'type' => $this->getErrorTypeFromException($exception),
            'message' => $exception->getMessage(),
        ];

        if ('prod' !== $event->getRequest()->server->get('APP_ENV')) {
            // TODO: Do not use this in production! This will potentially leak sensitive information.
            $data['file'] = $exception->getFile();
            $data['line'] = $exception->getLine();
            $data['trace'] = $exception->getTrace();
        }

        $response = new JsonResponse($data, $statusCode);
        $response->headers->set('Content-Type', 'application/problem+json');
        $event->setResponse($response);
    }

    private function getStatusCodeFromException(
        \Throwable $exception,
    ): int {
        if ($exception instanceof HttpException) {
            return $exception->getStatusCode();
        }

        return Response::HTTP_INTERNAL_SERVER_ERROR;
    }

    private function getErrorTypeFromException(
        \Throwable $exception,
    ): string {
        $parts = explode('\\', $exception::class);

        return end($parts);
    }
}
