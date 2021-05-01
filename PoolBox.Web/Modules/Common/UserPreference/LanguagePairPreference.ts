namespace PoolBox.Common {
    export class LanguagePairPreference implements Serenity.SettingStorage {
        getItem(): string {
            let value: string;

            UserPreferenceService.Retrieve({
                PreferenceType: "LanguagePairPreference",
                Name: 'Language pair ID'
            },
                response => value = response.Value,
                {
                    async: false
                });

            return value;
        }

        setItem(pairId: string): void {
            UserPreferenceService.Update({
                PreferenceType: "LanguagePairPreference",
                Name: 'Language pair ID',
                Value: pairId
            });
        }
    }
}