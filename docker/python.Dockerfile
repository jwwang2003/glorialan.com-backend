FROM python:3.14-rc

ENV PYTHONUNBUFFED 1
ENV PYTHONDONTWRITEBYTECODE 1

RUN apt update

RUN mkdir /app
WORKDIR /app
COPY ./src /app

COPY /requirements.txt /app/requirements.txt

# Install any required dependencies
RUN pip install --upgrade pip && pip install -r requirements.txt

# Expose port 8000 for Gunicorn
EXPOSE 8000