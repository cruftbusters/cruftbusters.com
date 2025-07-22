export function Planning() {
  return (
    <>
      <p>
        My plan is to extend Logbook to handle my accounting workflows. This
        could include small deliverable steps like:
      </p>
      <p>
        <ul>
          <li className="strike">
            reduce transfer separated-values text input to balance sheet
          </li>
          <li className="strike">multiple named books</li>
          <li className="strike">
            balance sheet summarizes multiple currencies and resource types.
            both prefix and suffix resource types (for example: kilowatt hours,
            assets like Google Pixel 9)
          </li>
          <li>logbook browser (create delete rename)</li>
          <li>local logbook persistence</li>
          <li>last affected column for balance sheet</li>
          <li>logbooks are composed of named pages</li>
          <li>
            filter input by start date, end date, account(s), logbook(s),
            page(s), prefix, and suffix
          </li>
          <li>filter "not" operator</li>
          <li>smart editor</li>
          <li>
            input for example: "assets - liabilities" calculates assets less
            liability
          </li>
          <li>
            balance timeseries (like every day, week, month, quarter, or year)
          </li>
          <li>bar graph for flow over time</li>
          <li>line graph for balance over time</li>
          <li>sankey for balance</li>
          <li>sync between multiple browsers/devices</li>
          <li>statement checking</li>
          <li>attach invoice to a transfer or group of transfers</li>
          <li>balance sheet group account rollup</li>
        </ul>
      </p>
    </>
  )
}
