# Hedvig Widget

## Testing

You can test the flow by running the following command:

```bash
http POST http://localhost:8040/api/widget flow=396324726 locale=se
```

- `flow` - The id of the Storyblok story (content type: `WidgetFlow`)
- returns a redirect to the beginning of the flow
