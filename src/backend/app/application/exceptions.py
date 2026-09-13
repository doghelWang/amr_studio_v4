class ApplicationError(Exception):
    """Base error raised by application use cases."""

    status_code = 500

    def __init__(self, detail):
        super().__init__(str(detail))
        self.detail = detail


class InvalidRequestError(ApplicationError):
    status_code = 400


class ResourceNotFoundError(ApplicationError):
    status_code = 404


class ModelValidationError(ApplicationError):
    status_code = 422


class ApplicationOperationError(ApplicationError):
    status_code = 500
